import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { CatatanService } from './catatan.service';
import {
  CreateCatatanArrayDto,
  CreateCatatanDto,
  findAllCatatanDto,
} from './catatan.dto';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CheckCreateBy } from 'src/utils/decorator/delete.decorator';

@UseGuards(JwtGuard)
@Controller('catatan')
export class CatatanController {
  constructor(private catatanService: CatatanService) {}
  @Post('tambah')
  async create(@InjectCreatedBy() payload: CreateCatatanArrayDto) {
    return this.catatanService.create(payload);
  }

  @Get('list')
  async list(@Pagination() query: findAllCatatanDto) {
    return this.catatanService.findAll(query);
  }

  @Delete('delete/:id')
  deleteBook(@CheckCreateBy('params') params: any) {
    return this.catatanService.deleteCatatan(
      Number(params.id),
      Number(params.created_by.id),
    );
  }
}
