import { JobItem } from "src/modules/jobs/lib/job-item";
import { JobStatus } from "src/modules/jobs/types/job.types";
import { ProjectsService } from "src/modules/projects/projects.service";


export abstract class Executor {

    constructor(public job: JobItem, public projectService: ProjectsService) {}

    abstract run(): Promise<void>;

    start() {
        this.job._job.status = JobStatus.RUNNING;
        this.job.update();
    }
}