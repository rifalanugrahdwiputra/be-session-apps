/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DosenEntity } from '../entities/dosen.entity';
import { LogTwEntity } from '../entities/log_tw.entity';
import { MahasiswaEntity } from '../entities/mahasiswa.entity';
import { ProgramStudiEntity } from '../entities/program_studi.entity';
import { SkripsiEntity } from '../entities/skripsi.entity';

@Injectable()
export class DashboardService {
  constructor(
    @Inject('DOSEN_REPOSITORY')
    private dosenRepository: Repository<DosenEntity>,
    @Inject('LOG_TW_REPOSITORY')
    private logTwRepository: Repository<LogTwEntity>,
    @Inject('MAHASISWA_REPOSITORY')
    private mahasiswaRepository: Repository<MahasiswaEntity>,
    @Inject('PROGRAM_STUDI_REPOSITORY')
    private programStudiRepository: Repository<ProgramStudiEntity>,
    @Inject('SKRIPSI_REPOSITORY')
    private skripsiRepository: Repository<SkripsiEntity>,
  ) { }

  async all() {
    try {
      try {
        const dosen = await this.dosenRepository
          .createQueryBuilder()
          .select()
          .getManyAndCount();
        const logtw = await this.logTwRepository
          .createQueryBuilder()
          .select()
          .getManyAndCount();
        const mahasiswa = await this.mahasiswaRepository
          .createQueryBuilder()
          .select()
          .getManyAndCount();
        const programstudi = await this.programStudiRepository
          .createQueryBuilder()
          .select()
          .getManyAndCount();
        const skripsi = await this.skripsiRepository
          .createQueryBuilder()
          .select()
          .getManyAndCount();
        let countDosen = dosen[1];
        let countLogTw = logtw[1];
        let countMahasiswa = mahasiswa[1];
        let countProgramStudi = programstudi[1];
        let countSkripsi = skripsi[1];
        let countAll = countDosen + countLogTw + countMahasiswa + countProgramStudi + countSkripsi;
        let statusCode = 200;
        return {
          statusCode,
          data: {
            countDosen: countDosen,
            countStudi: countProgramStudi,
            countLogUsers: countLogTw,
            countMahasiswa: countMahasiswa,
            countSkripsi: countSkripsi,
            chart: [
              {
                countAll: countAll,
              },
              {
                countDosen: countDosen,
              },
              {
                countStudi: countProgramStudi,
              },
              {
                countLogUsers: countLogTw,
              },
              {
                countMahasiswa: countMahasiswa,
              },
              {
                countSkripsi: countSkripsi,
              }
            ]
          }
        };
      }
      catch (e) {
        console.log(e)
      }
    }
    catch (error) {
      console.log(error);
    }
  }
}
