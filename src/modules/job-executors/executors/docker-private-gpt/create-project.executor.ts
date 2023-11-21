import { DockerPrivateGPTProvider } from "src/modules/providers/docker-private-gpt/docker-private-gpt.provider";
import { Executor } from "../executor";
import { JobItem } from "src/modules/jobs/lib/job-item";
import { ProjectsService } from "src/modules/projects/projects.service";


export class CreateProjectExecutor extends Executor {

  dockerPrivateGPTProvider: DockerPrivateGPTProvider;

  constructor(job: JobItem, projectsService: ProjectsService) {
    super(job, projectsService);

    this.dockerPrivateGPTProvider = new DockerPrivateGPTProvider();
  }

  async run(): Promise<void> {
    await this.dockerPrivateGPTProvider.setup(this.job._job.project);
    const isSetup = await this.dockerPrivateGPTProvider.projectIsAvailable(this.job._job.project);
    if (isSetup) {
      throw new Error(`Project ${this.job._job.project.name} already exists`);
    }

    await this.dockerPrivateGPTProvider.createProject(this.job._job.project);
    await this.job.complete({ message: `Project ${this.job._job.project.name} created` });
  }
}