import { JobStatus } from "../../types/job.types";
import { JobItem } from "../job-item";

export abstract class Executor {

    _job: JobItem;

    constructor(job: JobItem) {
        this._job = job;
    }

    abstract run(): Promise<void>;

    start() {
        this._job._job.status = JobStatus.RUNNING;
        this._job.update();
    }
}