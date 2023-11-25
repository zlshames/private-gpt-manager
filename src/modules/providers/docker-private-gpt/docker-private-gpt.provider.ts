import * as path from 'path';
import * as Docker from 'dockerode'; 
import slugify from 'slugify';
import { simpleGit } from 'simple-git';

import { Project } from 'src/modules/projects/projects.schema';
import { Provider, ProviderEvents } from '../provider';
import { existsSync, mkdirSync } from 'fs';
import { Document } from 'src/modules/documents/documents.schema';
import { Logger } from '@nestjs/common';
import { generateRandomNumber } from 'src/utils/random.utils';
import { CreateProjectProviderDto } from '../dto/provider.dto';


export class DockerPrivateGPTProvider extends Provider {
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

  get programmaticName(): string {
    return slugify(this.project.name).toLowerCase();
  }

  get containerName(): string {
    return `private-gpt-${this.programmaticName}`;
  }

  get projectPath(): string {
    return path.join(this.projectsPath, this.programmaticName);
  }

  get projectVolumesPath(): string {
    return path.join(this.projectPath, 'volumes');
  }

  get hostSourceDocsPath(): string {
    return path.join(this.projectVolumesPath, 'source_documents')
  }

  get projectFolderExists(): boolean {
    return existsSync(this.projectPath);
  }

  async setup(): Promise<void> {
    this.createDirectories();
  }

  createDirectories() {
    mkdirSync(this.projectsPath, { recursive: true });
    mkdirSync(this.projectPath, { recursive: true });
    mkdirSync(this.projectVolumesPath, { recursive: true });
  }

  async projectIsAvailable(): Promise<boolean> {
    return this.projectFolderExists && await this.dockerProjectIsSetup();
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

  private async dockerProjectIsSetup(): Promise<boolean> {
    const docker = await this.getDockerContainer(this.containerName);
    if (!docker) return false;

    const info = await docker.inspect();
    return info.State.Running;
  }

  private getPortsForProject(project: Project): number[] {
    const sluggedName = this.programmaticName;
    return [
      generateRandomNumber(10000, 50000, `${sluggedName}-api`),
      generateRandomNumber(10000, 50000, `${sluggedName}-web`),
    ];
  }

  async createProject(params?: CreateProjectProviderDto): Promise<void> {
    const dContainer = await this.getDockerContainer(this.programmaticName);
    this.emit(ProviderEvents.PROGRESS, 5, 100);

    // If we get back an existing container, we need to check the status.
    // Depending on the status, we may return early do some processing and
    // continue.
    if (dContainer) {
      const info = await dContainer.inspect();

      // If the container is running, we don't need to do anything. Return early.
      if (info.State.Running) {
        return this.log.debug(`Project is already running. Not doing anything.`);
      }
      
      // If the container is restarting, we don't need to do anything. Return early.
      if (info.State.Status === 'restarting') {
        return this.log.debug(`Project is currently restarting. Not doing anything.`);
      }

      // If we exited with an error, we should remove the container entirely and start over.
      // This will allow the latest image to be pulled and the container to be recreated.
      // If it exited previously without an error, we just want to start it back up. Return early.
      if (info.State.Status === 'exited' && info.State.ExitCode !== 0) {
        this.log.debug(`Project exited with code ${info.State.ExitCode}. Removing it now...`);
        await dContainer.remove({ force: true });
      } else if (info.State.Status === 'exited') {
        this.log.debug(`Project is stopped/exited. Starting it now...`);
        await dContainer.start();
        this.log.debug(`Project started!`);
        return;
      }
    }

    this.emit(ProviderEvents.PROGRESS, 10, 100);
    const docker = new Docker();
    const imageTag = 'pgpt-manager/embed-ai'

    this.log.debug(`Creating docker image...`);
    await this.createDockerImage('https://github.com/zlshames/EmbedAI.git', imageTag);
    this.log.debug(`Docker image created!`);
    this.emit(ProviderEvents.PROGRESS, 50, 100);

    const [apiPort, _] = this.getPortsForProject(this.project);
    const remoteDocsVolume = '/root/privateGPT/server/source_documents';
    
    // Create the docker container
    this.log.debug(`Creating docker container: ${this.programmaticName}`);
    const container = await docker.createContainer({
      Image: imageTag,
      name: this.programmaticName,
      Volumes: {},
      ExposedPorts: {
        '5000/tcp': {}
      },
      HostConfig: {
        Binds: [`${this.hostSourceDocsPath}:${remoteDocsVolume}`],
        PortBindings: {
          '5000/tcp': [{ HostPort: apiPort.toString() }],
        }
      }
    });

    this.emit(ProviderEvents.PROGRESS, 90, 100);
    this.log.debug(`Docker container created: ${this.project.name}`);
    if (!params.start) return;

    
    this.log.debug(`Starting docker container: ${this.project.name}`);
    await container.start();
    this.log.debug(`Docker container started: ${this.project.name}`);
  }

  async createDockerImage(gitLink: string, tag: string): Promise<void> {
    this.log.log(`Cloning: ${gitLink}`);
    const repoPath = path.join(this.appDataPath, tag.replaceAll('/', '-').replaceAll(':', '-'));

    // Ignore errors if the repo already exists
    let pullSummary = null;
    await simpleGit().clone(gitLink, repoPath).catch(async () => {
      this.log.log(`Repo already exists. Pulling latest changes...`);
      pullSummary = await simpleGit(repoPath).pull();
    });

    // Check if the docker image exists
    const docker = new Docker();
    const images = await docker.listImages();
    const imageExists = images.some(image => image.RepoTags.includes(tag));
    const hasChanges = !!pullSummary?.summary?.changes || !!pullSummary?.summary?.insertions || !!pullSummary?.summary?.deletions;

    if (imageExists || !hasChanges) {
      this.log.log(`Docker image already exists or no changes were pulled. Not rebuilding.`);
      return;
    }

    this.log.log(`Building docker image: ${tag}`);
    const stream = await docker.buildImage({
      context: repoPath,
      // All files in repoPath
      src: ['.'],
    }, { t: tag });

    // Log the output of the build
    stream.on('data', (data) => {
      this.log.debug(data.toString());
    });

    this.log.log(`Waiting for docker image build to finish...`);
    await new Promise((resolve, reject) => {
      docker.modem.followProgress(stream, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

  async pullDockerImage(image: string): Promise<void> {
    const docker = new Docker();
    return new Promise((resolve, reject) => {
      docker.pull(image, (err, stream) => {
        if (err) return reject(err);

        const onFinished = (err, output) => {
          if (err) return reject(err);
          resolve(output);
        }
  
        const onProgress = (event) => {
          console.log(JSON.stringify(event));
        }

        docker.modem.followProgress(stream, onFinished, onProgress);
      });
    });
  }

  async startProject(): Promise<void> {
    // Check if the container exists
    const container = await this.getDockerContainer(this.containerName);

    // If it doesn't, create the project
    if (!container) {
      return await this.createProject();
    }

    // If it does, check if it's running
    return await container.start();
  }

  async stopProject(): Promise<void> {
    // Check if the container exists
    const container = await this.getDockerContainer(this.containerName);

    // If it doesn't, throw an error
    if (!container) {
      throw new Error(`Container ${this.containerName} does not exist`);
    }

    // Don't do anything if the container is already stopped
    const info = await container.inspect();
    if (!info.State.Running) return;

    // If it does, check if it's running
    return await container.stop();
  }

  async enableProject(): Promise<void> {
    // Check if the container exists
    const container = await this.getDockerContainer(this.containerName);

    // If it doesn't, create it
    if (!container) {
      return await this.createProject();
    }
  }

  async disableProject(): Promise<void> {
    // Check if the container exists.
    // If it doesn't, don't do anything
    const container = await this.getDockerContainer(this.containerName);
    if (!container) return;

    // If the container exists and is running, stop it
    const info = await container.inspect();
    if (!info.State.Running) return;

    return await container.stop();
  }

  async deleteProject(): Promise<void> {
    // Check if the container exists
    const container = await this.getDockerContainer(this.containerName);

    // If it doesn't, don't do anything
    if (!container) return;

    // If it does, stop it and remove it
    const info = await container.inspect();
    if (info.State.Running) {
      await container.stop();
    }

    await container.remove({ force: true });
  }

  ingestFile(path: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}