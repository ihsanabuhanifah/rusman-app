import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Between, Like, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import BaseResponse from 'src/utils/response/base.response';
import { InjectRepository } from '@nestjs/typeorm';
import { Catatan } from './catatan.entity';
import { CreateCatatanArrayDto, findAllCatatanDto } from './catatan.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
@Injectable()
export class CatatanService extends BaseResponse {
  constructor(
    @InjectRepository(Catatan)
    private readonly catatanRepository: Repository<Catatan>,
    @Inject(REQUEST) private req: any,
  ) {
    super();
  }

  async create(payload: CreateCatatanArrayDto): Promise<ResponseSuccess> {
    try {
      let berhasil = 0;
      let gagal = 0;
      await Promise.all(
        payload.catatan.map(async (data) => {
          data.created_by = { id: this.req.user.id };
          try {
            await this.catatanRepository.save(data);

            berhasil += 1;
          } catch {
            gagal += 1;
          }
        }),
      );

      return this._success(`Berhasil menyimpan ${berhasil} dan gagal ${gagal}`);
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(query: findAllCatatanDto): Promise<ResponsePagination> {
    const { page, pageSize, limit, keyword } = query;

    const filterQuery = {};
    const filterKeyword = [];

    if (keyword) {
      filterKeyword.push(
        {
          siswa: {
            nama_siswa: Like(`%${keyword}%`),
          },
        },
        {
          kelas: Like(`%${keyword}%`),
        },
      );
    }

    const total = await this.catatanRepository.count({
      where: keyword ? filterKeyword : filterQuery,
    });

    const result = await this.catatanRepository.find({
      where: keyword ? filterKeyword : filterQuery,
      relations: ['created_by', 'updated_by', 'siswa'],
      select: {
        id: true,
        kategori: true,
        poin: true,
        keterangan: true,
        tanggal: true,
        kelas: true,
        semester: true,
        ta_id: true,

        siswa: {
          id: true,
          nama_siswa: true,
        },
        created_by: {
          id: true,
          nama: true,
        },
        updated_by: {
          id: true,
          nama: true,
        },
      },

      skip: limit,
      take: pageSize,
      order: {
        tanggal: 'DESC',
      },
    });
    return this._pagination('OK', result, total, page, pageSize);
  }

  async deleteCatatan(
    id: number,
    created_by: number,
  ): Promise<ResponseSuccess> {
    const check = await this.catatanRepository.findOne({
      where: {
        id,
      },
      relations: ['created_by'],
      select: {
        id: true,
        created_by: {
          id: true,
        },
      },
    });

    if (!check) throw new NotFoundException(`Catatan tidak ditemukan`);
    if (check.created_by.id !== created_by) {
      throw new HttpException(
        'Tidak dapat menghapus karena catatan ini dibuat oleh user lain',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.catatanRepository.delete(id);
    return this._success(`Berhasil menghapus catatan`);
  }
}
