import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { CatatanService } from './catatan.service';
import {
  CreateCatatanArrayDto,
  CreateCatatanDto,
  findAllCatatanDto,
} from './catatan.dto';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';

@UseGuards(JwtGuard)
@Controller('catatan')
export class CatatanController {
  constructor(private catatanService: CatatanService) {}
  @Post('tambah')
  async create(@InjectCreatedBy() payload: CreateCatatanArrayDto) {
    return this.catatanService.create(payload);
  }

  @Get('list')
  async list(@Query() query: findAllCatatanDto) {
    return this.catatanService.findAll(query);
  }
}
