import { JobStatus, JobTypes } from "../types/job.types";
import { CreateProjectExecutor } from "./executors/docker-private-gpt/create-project.executor";
import { DeleteProjectExecutor } from "./executors/docker-private-gpt/delete-project-executor";
import { IngestDocumentExecutor } from "./executors/docker-private-gpt/ingest-document.executor";
import { JobItem } from "./job-item";
import { JobsService } from "../jobs.service";

require('dotenv').config();


export class JobExecutor {

    /**
     * The maximum number of jobs that can run at once
     */
    private _maxConcurrentJobs = parseInt(process.env.MAX_CONCURRENT_JOBS) || 1;

    /**
     * A list of job promises that are currently running
     */
    private _runningJobs: Promise<JobItem>[] = [];

    /**
     * A promise that resolves when the runJobs function is complete
     */
    private runJobsPromise: Promise<void> = null;

    /**
     * Whether or not we can run more jobs
     */
    get canRunMoreJobs(): boolean {
        return this._runningJobs.length < this._maxConcurrentJobs;
    }
    
    constructor(private jobsService: JobsService) {}

    /**
     * Fail any jobs that were running when the server was restarted
     */
    async closeIncompleteJobs(): Promise<void> {
        // TODO: Get all jobs that are running
        const jobs = [];

        await Promise.all(jobs.map(async job => {
            if (job._job.status === JobStatus.RUNNING) {
                await job.fail({
                    errors: [
                        {
                            message: 'Job was halted when the server was restarted'
                        }
                    ],
                    message: 'Failed to complete job'
                });
            }
        }));
    }

    /**
     * Starts the Job Executor.
     * This will close any jobs that were running when the server was restarted.
     * It will then run any pending jobs.
     */
    async start() {
        await this.closeIncompleteJobs();
        await this.runJobs();
    }

    /**
     * A function that is called when a job is completed.
     *
     * @param job The job that was completed
     */
    async onComplete(_: JobItem) {
        // When a job is completed, run any other jobs that are pending (if we can)
        this.runJobs();
    }

    /**
     * Handler for running jobs. This will run any jobs that are pending.
     * It will not allow more than the max concurrent jobs to run at once.
     * This function will only run one time at a time. If a "run" is already
     * in progress, this function will return the existing promise.
     */
    async runJobs(): Promise<void> {
        if (!this.canRunMoreJobs) return;

        // We only want to run this code once at a time
        if (this.runJobsPromise != null) return this.runJobsPromise;

        this.runJobsPromise = new Promise(async (resolve, reject) => {
            try {
                const jobs = await this.getJobsToRun();
            
                // Only run jobs up to the max concurrent jobs
                const jobsToRun = jobs.slice(0, this._maxConcurrentJobs - this._runningJobs.length);

                // Run the jobs
                for (const job of jobsToRun) {
                    const jobPromise = this.runJob(job);

                    // Add the promise to the running jobs list
                    this._runningJobs.push(jobPromise);

                    // When the job is complete, remove it from the list of running jobs
                    jobPromise.then(() => {
                        this._runningJobs = this._runningJobs.filter(j => j !== jobPromise);
                        this.onComplete(job);
                    }).catch(async (err) => {
                        // If an uncaught exception occurs, mark the job as failed
                        await job.fail({
                            errors: [
                                {
                                    message: String(err)
                                }
                            ],
                            message: 'Job failed with an uncaught exception!'
                        });

                        // TODO: Log error
                        this._runningJobs = this._runningJobs.filter(j => j !== jobPromise);
                        this.onComplete(job);
                    });
                }

                resolve();
            } catch (err) {
                reject(err);
            }
        });

        // When the jobs are complete, clear the promise
        this.runJobsPromise.then(() => {
            this.runJobsPromise = null;
        }).catch(() => {
            // TODO: Log error
            this.runJobsPromise = null;
        });

        return this.runJobsPromise;
    }

    /**
     * Load jobs that are in the pending state
     *
     * @returns {JobItem[]}
     */
    async getJobsToRun(): Promise<JobItem[]> {
        const jobs = await this.jobsService.find({
            params: {
                status: JobStatus.PENDING
            }
        });

        return jobs.map(job => new JobItem(job));
    }

    /**
     * Runs an individual job
     * 
     * @param job The job to run
     * @returns {JobItem} The JobItem after running the job
     */
    async runJob(job: JobItem): Promise<JobItem> {
        // Get the executor for the job
        const executor = this.getJobExecutor(job);
    
        // Run the job
        await executor.run();

        // Get the job as it is now
        const jobNow = await this.jobsService.findOne({ id: job._job._id });
        if (!jobNow) {
            throw new Error(`Job #${job._job._id} not found after running job!`);
        }

        return new JobItem(jobNow);
    }

    /**
     * Gets the executor for the job at hand.
     * 
     * @param job The job to get the executor for
     * @returns {Executor} The executor for the job
     */
    getJobExecutor(job: JobItem) {
        switch (job._job.type) {
            case JobTypes.CREATE_PROJECT:
                return new CreateProjectExecutor(job);
            case JobTypes.DELETE_PROJECT:
                return new DeleteProjectExecutor(job);
            case JobTypes.INGEST_DOCUMENT:
                return new IngestDocumentExecutor(job);
            default:
                throw new Error(`Unknown job type: ${job._job.type}`);
        }
    }
}