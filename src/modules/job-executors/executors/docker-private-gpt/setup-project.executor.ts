import { JobItem } from "src/modules/jobs/lib/job-item";
import { DockerPrivateGPTProvider } from "src/modules/providers/docker-private-gpt/docker-private-gpt.provider";
import { Executor } from "../executor";
import { ProjectsService } from "src/modules/projects/projects.service";


export class SetupProjectExecutor extends Executor {

  dockerPrivateGPTProvider: DockerPrivateGPTProvider;

  constructor(job: JobItem, projectsService: ProjectsService) {
    super(job, projectsService);

    this.dockerPrivateGPTProvider = new DockerPrivateGPTProvider(job._job.project);
  }

  async run(): Promise<void> {
    const isSetup = await this.dockerPrivateGPTProvider.projectIsAvailable();
    if (isSetup) {
      throw new Error(`Project ${this.job._job.project.name} already exists`);
    }

    await this.dockerPrivateGPTProvider.setup();
  }
}