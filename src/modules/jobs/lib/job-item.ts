import { Job } from "../jobs.schema";
import { JobOutput, JobStatus } from "../types/job.types";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class JobItem {
    _job: Job;

    @InjectModel(Job.name)
    private jobModel: Model<Job>;

    get isFinished(): boolean {
        return [
            JobStatus.COMPLETED,
            JobStatus.COMPLETED_WITH_ERRORS,
            JobStatus.FAILED,
            JobStatus.CANCELLED
        ].includes(this._job.status);
    }

    constructor(job: Job) {
        this._job = job;
    }

    async update() {
        await this.jobModel.updateOne(this._job).exec();
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