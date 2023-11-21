import { Document } from '../documents/documents.schema';
import type { Project } from '../projects/projects.schema';


export abstract class Provider {
    abstract setup(project: Project): Promise<void>;

    abstract projectIsAvailable(project: Project): Promise<boolean>;

    abstract createProject(project: Project): Promise<void>;

    abstract deleteProject(project: Project): Promise<void>;

    abstract ingestFile(project: Project, path: string): Promise<void>;

    abstract getDocuments(project: Project): Promise<Document>;
    
    abstract teardown(): Promise<void>;
}