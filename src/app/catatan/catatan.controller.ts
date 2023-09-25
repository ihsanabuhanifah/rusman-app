import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/auth.guard';
import { CatatanService } from './catatan.service';
import {
  CreateCatatanArrayDto,
  UpdateCatatanDto,
  findAllCatatanDto,
} from './catatan.dto';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { Pagination } from 'src/utils/decorator/pagination.decorator';
import { CheckCreateBy } from 'src/utils/decorator/delete.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';

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

  @Get('detail/:id')
  findOneBook(@Param('id') id: string) {
    return this.catatanService.getDetail(Number(id));
  }

  @Delete('delete/:id')
  deleteBook(@CheckCreateBy('params') params: any) {
    return this.catatanService.deleteCatatan(
      Number(params.id),
      Number(params.created_by.id),
    );
  }

  @Put('update/:id')
  updateBook(
    @Param('id') id: string,
    @InjectUpdatedBy() payload: UpdateCatatanDto,
  ) {
    return this.catatanService.updateBook(Number(id), payload);
  }
}
