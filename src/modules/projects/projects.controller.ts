import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { FindProjectsDto } from './dto/find-projects.dto';
import { PutProjectMetadataDto } from './dto/put-project-metadata.dto';
import { SetProjectMetadataDto } from './dto/set-project-metadata.dto';
import { FindOneProjectDto } from './dto/find-one-project.dto';
import { pipeline } from 'node:stream';
import { createWriteStream } from 'fs';
import { promisify } from 'node:util';


@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  async find(@Query() query: FindProjectsDto) {
    return await this.projectsService.find(query);
  }

  @Get(':id')
  async findOne(@Param() params: FindOneProjectDto) {
    return await this.projectsService.findOne(params);
  }

  @Post()
  async create(@Body() data: CreateProjectDto) {
    return await this.projectsService.create(data);
  }

  @Post(':id/enable')
  async enable(@Param() param) {
    return await this.projectsService.enable(param.id);
  }

  @Post(':id/disable')
  async disable(@Param() param) {
    return await this.projectsService.disable(param.id);
  }

  @Post(':id/stop')
  async stop(@Param() param) {
    return await this.projectsService.stop(param.id);
  }

  @Put(':id')
  async update(@Param() param, @Body() body: CreateProjectDto) {
    const data = await this.projectsService.update(param.id, body);
    return {
      message: `Project ${param.id} updated`,
      data
    }
  }

  @Post(':id/metadata')
  async setMetadata(@Param() param, @Body() body: PutProjectMetadataDto) {
    const data = await this.projectsService.setProjectMetadata(param.id, body);
    return {
      message: `Metadata for project ${param.id} updated`,
      data
    }
  }

  @Put(':id/metadata')
  async putMetadata(@Param() param, @Body() body: SetProjectMetadataDto) {
    const data = await this.projectsService.putProjectMetadata(param.id, body);
    return {
      message: `Metadata for project ${param.id} updated`,
      data
    }
  }

  //Save files in directory
  async handler(field: string, file: any, filename: string, encoding: string, mimetype: string): Promise<void> {
    const pipe = promisify(pipeline);
    const writeStream = createWriteStream(`uploads/${filename}`); //File path
    try {
      await pipe(file, writeStream);
    } catch (err) {
      console.error('Pipeline failed', err);
    }
  }

  @Post(':id/document/upload')
  async addDocument(@Req() req, @Body() body) {
    console.log("BODY", body);
    if (req.isMultipart()) {
      console.log("MULTIPART");
    }

    const mp = await req.multipart(this.handler, onEnd);
    // for key value pairs in request
    mp.on('field', function(key: any, value: any) {
      console.log('form-data', key, value);
    });

    // Uploading finished
    async function onEnd(err: any) {
      if (err) {
        console.log("ERR", err);
        return 
      }
      
      console.log('success')
    }

    // const data = await this.projectsService.createDocument(param.id, body);
    // return {
    //   message: `Document created for project ${param.id}`,
    //   data
    // }
  }

  @Delete(':id')
  async delete(@Param() params) {
    const data = await this.projectsService.delete(params.id);
    if (!data) {
      return {
        error: `Project ${params.id} not found`
      }
    }

    return {
      message: `Project ${params.id} deleted`,
      data
    }
  }

  @Delete(':id/hard')
  async hardDelete(@Param() params) {
    await this.projectsService.hardDelete(params.id);
    return {
      message: `Project ${params.id} permanently deleted`
    }
  }
}
