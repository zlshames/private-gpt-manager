import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { FindAlertsDto } from './dto/find-alerts.dto';
import { MarkAlertsReadDto } from './dto/mark-alerts-read.dto';


@Controller('alerts')
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Get()
  async find(@Query() query: FindAlertsDto) {
    return await this.alertsService.find(query);
  }

  @Post('read')
  async markRead(@Body() body: MarkAlertsReadDto) {
    const result = await this.alertsService.markRead(body);
    return {
      message: `${result.modifiedCount} alert(s) marked as read!`,
      data: {
        acknowledged: result.acknowledged,
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      }
    };
  }
}
