import * as path from 'path';
import * as Docker from 'dockerode'; 
import slugify from 'slugify';

import { Project } from 'src/modules/projects/projects.schema';
import { Provider } from '../provider';
import { existsSync, mkdirSync } from 'fs';
import { Document } from 'src/modules/documents/documents.schema';
import { Logger } from '@nestjs/common';
import { generateRandomNumber } from 'src/utils/random.utils';


export class DockerPrivateGPTProvider implements Provider {
  private log = new Logger(DockerPrivateGPTProvider.name);

  get appDataPath(): string {
    return path.join(
      process.env.APPDATA || (process.platform == 'darwin'
        ? process.env.HOME + '/Library/Application Support'
        : process.env.HOME + "/.local/share"
      ),
      'docker-private-gpt'
    )
  }

  get projectsPath(): string {
    return path.join(this.appDataPath, 'projects');
  }

  getContainerName(project: Project): string {
    return `private-gpt-${slugify(project.name)}`;
  }

  async setup(project: Project) {
    this.createDirectories(project);
  }

  createDirectories(project: Project) {
    mkdirSync(this.projectsPath, { recursive: true });
    mkdirSync(this.getProjectPath(project), { recursive: true });
    mkdirSync(this.getProjectVolumesPath(project), { recursive: true });
  }

  async projectIsAvailable(project: Project): Promise<boolean> {
    const projectFolderExists = this.projectFolderExists(project);
    const dockerProjectIsSetup = await this.dockerProjectIsSetup(project);
    return projectFolderExists && dockerProjectIsSetup;
  }

  private getProjectPath(project: Project): string {
    const sluggedName = slugify(project.name);
    return path.join(this.projectsPath, sluggedName);
  }

  private getProjectVolumesPath(project: Project): string {
    return path.join(this.getProjectPath(project), 'volumes');
  }

  private projectFolderExists(project: Project): boolean {
    return existsSync(this.getProjectPath(project));
  }

  private async getDockerContainer(name: string): Promise<Docker.Container> {
    const docker = new Docker();
    const containers = await docker.listContainers({
      all: true,
      filters: {
        name: [name]
      }
    });

    if (containers.length === 0) {
      return null;
    }

    return docker.getContainer(containers[0].Id);
  }

  private async dockerProjectIsSetup(project: Project): Promise<boolean> {
    const docker = await this.getDockerContainer(this.getContainerName(project));
    if (!docker) return false;

    const info = await docker.inspect();
    return info.State.Running;
  }

  private getPortForProject(project: Project): number {
    const sluggedName = slugify(project.name);
    return generateRandomNumber(10000, 65535, sluggedName);
  }

  async createProject(project: Project): Promise<void> {
    const docker = new Docker();

    this.log.debug(`Pulling docker container: rattydave/privategpt`);
    await this.pullDockerImage('rattydave/privategpt:latest');
    this.log.debug(`Docker container pulled: rattydave/privategpt`);

    const name = this.getContainerName(project);
    const port = this.getPortForProject(project);
    let hostDocsVolume = path.join(this.getProjectVolumesPath(project), 'source_documents')
    const remoteDocsVolume = '/root/privateGPT/server/source_documents';
    
    // Create the docker container
    this.log.debug(`Creating docker container: ${name}`);
    const container = await docker.createContainer({
      Image: 'rattydave/privategpt',
      name,
      Volumes: {},
      HostConfig: {
        Binds: [`${hostDocsVolume}:${remoteDocsVolume}`],
        PortBindings: {
          [`3000/tcp`]: [{ HostPort: port }]
        }
      },
    });

    this.log.debug(`Docker container created: ${name}`);
    this.log.debug(`Starting docker container: ${name}`);
    await container.start();
    this.log.debug(`Docker container started: ${name}`);
  }

  async pullDockerImage(image: string): Promise<void> {
    const docker = new Docker();
    return new Promise((resolve, reject) => {
      docker.pull(image, (err, stream) => {
        if (err) return reject(err);

        function onFinished(err, output) {
            if (err) {
                return reject(err);
            }
  
            console.log(output);
            resolve(output);
        }
  
        function onProgress(event) {
            console.log(JSON.stringify(event));
        }

        docker.modem.followProgress(stream, onFinished, onProgress);
    });
  });
  }

  deleteProject(project: Project): Promise<void> {
    throw new Error('Method not implemented.');
  }

  ingestFile(project: Project, path: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getDocuments(project: Project): Promise<Document> {
    throw new Error('Method not implemented.');
  }

  teardown(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}