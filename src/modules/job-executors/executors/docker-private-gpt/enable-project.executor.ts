import { DockerPrivateGPTProvider } from "src/modules/providers/docker-private-gpt/docker-private-gpt.provider";
import { Executor } from "../executor";
import { JobItem } from "src/modules/jobs/lib/job-item";
import { ProjectsService } from "src/modules/projects/projects.service";
import { ProviderEvents } from "src/modules/providers/provider";


export class EnableProjectExecutor extends Executor {

  dockerPrivateGPTProvider: DockerPrivateGPTProvider;

  constructor(job: JobItem, projectsService: ProjectsService) {
    super(job, projectsService);

    this.dockerPrivateGPTProvider = new DockerPrivateGPTProvider(job._job.project);
  }

  async run(): Promise<void> {
    await this.dockerPrivateGPTProvider.setup();
    await this.dockerPrivateGPTProvider.enableProject();
    await this.job.complete({ message: `Project ${this.job._job.project.name} enabled` });
  }
}