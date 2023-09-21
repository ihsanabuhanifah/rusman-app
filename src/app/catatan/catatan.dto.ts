import {
  IsArray,
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Kategori } from './catatan.entity';
import { OmitType } from '@nestjs/mapped-types';
import BaseResponse from 'src/utils/response/base.response';
import { PageRequestDto } from 'src/utils/dto/page.dto';
import { Type } from 'class-transformer';

export class CatatanDto {
  @IsInt()
  id: number;

  @IsDate()
  tanggal: Date;

  @IsNumber()
  @IsNotEmpty()
  @IsIn([Kategori.PELANGGARAN, Kategori.PRESTASI])
  kategori: Kategori;

  @IsString()
  @IsNotEmpty()
  keterangan: string;

  @IsNumber()
  @IsNotEmpty()
  poin: number;

  @IsString()
  @IsNotEmpty()
  kelas: string;

  @IsString()
  @IsNotEmpty()
  semester: string;

  @IsNumber()
  @IsNotEmpty()
  ta_id: number;

  @IsOptional()
  updated_count: number;

  @IsObject()
  @IsNotEmpty()
  siswa: { id: number };

  @IsObject()
  @IsOptional()
  updated_by: { id: number };
  @IsObject()
  @IsOptional()
  created_by: { id: number };
}

export class CreateCatatanDto extends OmitType(CatatanDto, [
  'id',
  'updated_count',
]) {}

export class CreateCatatanArrayDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCatatanDto)
  catatan: CreateCatatanDto[];
}

export class findAllCatatanDto extends PageRequestDto {}
