import * as EventEmitter from 'events';
import { Document } from '../documents/documents.schema';
import type { Project } from '../projects/projects.schema';
import { CreateProjectProviderDto } from './dto/provider.dto';


export enum ProviderEvents {
    PROGRESS = 'progress',
}

export abstract class Provider extends EventEmitter {

    private _project: Project;

    get project(): Project {
        return this._project;
    }

    set project(project: Project) {
        this._project = project;
    }

    constructor(project: Project) {
        super();
        this._project = project;
    }

    abstract setup(): Promise<void>;

    abstract projectIsAvailable(): Promise<boolean>;

    abstract createProject(params?: CreateProjectProviderDto): Promise<void>;

    abstract startProject(): Promise<void>;

    abstract stopProject(): Promise<void>;

    abstract enableProject(): Promise<void>;

    abstract disableProject(): Promise<void>;

    abstract deleteProject(): Promise<void>;

    abstract ingestFile(path: string): Promise<void>;
}