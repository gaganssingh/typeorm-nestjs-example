import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('seed')
  async seedDb() {
    await this.appService.seed();
    return {
      success: true,
      message: 'Seeding the db complete',
    };
  }

  @Get()
  async getAll() {
    return await this.appService.getAll();
  }

  @Get(':id')
  async getEmployeeById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appService.getEmployeeById(id);
  }

  @Get('custom/:id')
  async getEmployeeByIdCUSTOM(@Param('id', ParseUUIDPipe) id: string) {
    console.log('custom query builder....');
    return await this.appService.getEmployeeByIdCUSTOM(id);
  }

  @Delete(':id')
  async deleteEmployee(@Param('id', ParseUUIDPipe) id: string) {
    return await this.appService.delete(id);
  }
}
