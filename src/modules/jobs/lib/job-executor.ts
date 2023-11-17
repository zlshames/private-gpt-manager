import { JobStatus, JobTypes } from "../types/job.types";
import { CreateProjectExecutor } from "./executors/docker-private-gpt/create-project.executor";
import { DeleteProjectExecutor } from "./executors/docker-private-gpt/delete-project-executor";
import { IngestDocumentExecutor } from "./executors/docker-private-gpt/ingest-document.executor";
import { JobItem } from "./job-item";

require('dotenv').config();

export class JobExecutor {

    private _maxConcurrentJobs = parseInt(process.env.MAX_CONCURRENT_JOBS) || 1;

    private _runningJobs: Promise<JobItem>[] = [];

    private jobRunPromise: Promise<void> = null;

    get canRunMoreJobs(): boolean {
        return this._runningJobs.length < this._maxConcurrentJobs;
    }
    
    constructor({
        maxConcurrentJobs = 1
    }: {
        maxConcurrentJobs?: number
    } = {}) {
        if (maxConcurrentJobs) {
            this._maxConcurrentJobs = maxConcurrentJobs;
        }
    }

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

    async start() {
        await this.closeIncompleteJobs();
        await this.runJobs();
    }

    async onComplete(_: JobItem) {
        // When a job is completed, run any other jobs that are pending (if we can)
        this.runJobs();
    }

    async runJobs(): Promise<void> {
        if (!this.canRunMoreJobs) return;

        // We only want to run this code once at a time
        if (this.jobRunPromise != null) return this.jobRunPromise;

        this.jobRunPromise = new Promise((resolve, reject) => {
            try {
                const jobs = this.getJobsToRun();
            
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
        this.jobRunPromise.then(() => {
            this.jobRunPromise = null;
        }).catch(() => {
            // TODO: Log error
            this.jobRunPromise = null;
        });

        return this.jobRunPromise;
    }

    /**
     * Load jobs that are in the pending state
     *
     * @returns {JobItem[]}
     */
    getJobsToRun(): JobItem[] {
        // TODO: Get pending jobs
        return [];
    }

    async runJob(job: JobItem) {
        // Get the executor for the job
        const executor = this.getJobExecutor(job);
    
        // Run the job
        await executor.run();

        return job;
    }

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