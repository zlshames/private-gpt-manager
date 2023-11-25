import { DockerPrivateGPTProvider } from "src/modules/providers/docker-private-gpt/docker-private-gpt.provider";
import { Executor } from "../executor";
import { JobItem } from "src/modules/jobs/lib/job-item";
import { ProjectsService } from "src/modules/projects/projects.service";
import { ProviderEvents } from "src/modules/providers/provider";


export class CreateProjectExecutor extends Executor {

  dockerPrivateGPTProvider: DockerPrivateGPTProvider;

  constructor(job: JobItem, projectsService: ProjectsService) {
    super(job, projectsService);

    this.dockerPrivateGPTProvider = new DockerPrivateGPTProvider(job._job.project);
  }

  async run(): Promise<void> {
    await this.dockerPrivateGPTProvider.setup();
    const isSetup = await this.dockerPrivateGPTProvider.projectIsAvailable();
    if (isSetup) {
      throw new Error(`Project ${this.job._job.project.name} already exists`);
    }

    this.dockerPrivateGPTProvider.on(ProviderEvents.PROGRESS, async (progress, total) => {
      // Round with no decimals
      this.job._job.progress = Math.round(progress / total * 100);
      await this.job.update();
    });

    await this.dockerPrivateGPTProvider.createProject();
    await this.job.complete({ message: `Project ${this.job._job.project.name} created` });
  }
}