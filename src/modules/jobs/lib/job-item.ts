import { Job } from "../jobs.schema";
import { JobsService } from "../jobs.service";
import { JobOutput, JobStatus } from "../types/job.types";


export class JobItem {
    _job: Job;

    _jobsService: JobsService;

    get isFinished(): boolean {
        return [
            JobStatus.COMPLETED,
            JobStatus.COMPLETED_WITH_ERRORS,
            JobStatus.FAILED,
            JobStatus.CANCELLED
        ].includes(this._job.status);
    }

    constructor(job: Job, jobsService: JobsService) {
        this._job = job;
        this._jobsService = jobsService;
    }

    async update() {
        await this._jobsService.update(this._job._id, this._job);
    }

    async complete(output: JobOutput): Promise<void> {
        this._job.status = JobStatus.COMPLETED;
        this._job.progress = 100;
        this._job.output = output;
        await this.update();
    }

    async completeWithErrors(output: JobOutput): Promise<void> {
        this._job.status = JobStatus.COMPLETED_WITH_ERRORS;
        this._job.progress = 100;
        this._job.output = output;
        await this.update();
    }

    async fail(output: JobOutput): Promise<void> {
        this._job.status = JobStatus.FAILED;
        this._job.output = output;
        // Don't set progress to 100% here, because we want to be able to
        // be able to either pick up where we left off, or know at what
        // point the job failed.
        await this.update();
    }

    async cancel(output: JobOutput): Promise<void> {
        this._job.status = JobStatus.CANCELLED;
        this._job.output = output;
        // Don't set progress to 100% here, because we want to be able to
        // be able to either pick up where we left off, or know at what
        // point the job failed.
        await this.update();
    }
}