/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateCategory } from 'src/infra/models/jobCategories.model';
import { Repository } from 'typeorm';
import { JobCategoryEntity } from '../entities/jobCategories.entity';
import { JobCategoryDTO } from 'src/app/dtos/categories.dto';
@Injectable()
export class JobsCategoriesService {
  constructor(
    @Inject('JOB_CATEGORY_REPOSITORY')
    private jobCategoryRepository: Repository<JobCategoryEntity>,
  ) { }

  async create(body: CreateCategory) {
    const existingCategory = await this.jobCategoryRepository.findOne({
      where: { category: body.category_name },
    });
    // await this.cacheManager.reset();
    if (existingCategory && existingCategory.is_active) {
      throw new HttpException('Category already exists', 409);
    } else if (existingCategory && !existingCategory.is_active) {
      await this.jobCategoryRepository
        .createQueryBuilder()
        .update(JobCategoryEntity)
        .set({
          is_active: true,
        })
        .where('id = :id', { id: existingCategory.id })
        .execute();
      return { message: 'Category created successfully' };
    }
    return await this.jobCategoryRepository
      .findOne({ where: { category: body.category_name } })
      .then((category) => {
        if (category) {
          throw new HttpException('Category already exists', 409);
        } else {
          this.jobCategoryRepository
            .createQueryBuilder()
            .insert()
            .into(JobCategoryEntity)
            .values({
              is_active: true,
              category: body.category_name,
            })
            .execute();
          return { message: 'Category created successfully' };
        }
      });
  }

  async update(body: CreateCategory, id: number) {
    // await this.cacheManager.reset();
    return this.jobCategoryRepository
      .findOne({ where: { id: id } })
      .then(async (category) => {
        if (category) {
          const existingCategory = await this.jobCategoryRepository.findOne({
            where: { category: body.category_name },
          });
          if (existingCategory && existingCategory.id !== id) {
            throw new HttpException(
              'Another category with the same name already exists',
              409,
            );
          } else {
            await this.jobCategoryRepository
              .createQueryBuilder()
              .update(JobCategoryEntity)
              .set({
                category: body.category_name,
              })
              .where('id = :id', { id: id })
              .execute();
            return { message: 'Category updated successfully' };
          }
        } else {
          throw new HttpException('Category not found', 404);
        }
      });
  }

  async active(id: number) {
    // await this.cacheManager.reset();
    return this.jobCategoryRepository
      .findOne({ where: { id: id } })
      .then((category) => {
        if (category) {
          this.jobCategoryRepository
            .createQueryBuilder()
            .update(JobCategoryEntity)
            .set({
              is_active: true,
            })
            .where('id = :id', { id: id })
            .execute();
          return { message: 'Category activated successfully' };
        } else {
          throw new HttpException('Category not found', 404);
        }
      });
  }

  async deactive(id: number) {
    // await this.cacheManager.reset();
    // const jobdetail = await this.jobSubCategoryRepository.findOne({
    //   where: { category_id: id },
    // });
    // if (jobdetail) {
    //   await this.jobSubCategoryRepository
    //     .createQueryBuilder()
    //     .update(JobSubCategoryEntity)
    //     .set({
    //       is_active: false,
    //     })
    //     .where('category_id = :id', { id: id })
    //     .execute();

    //   const detail = await this.jobDetailRepository.findOne({
    //     where: { sub_category_id: jobdetail.id },
    //   });
    //   if (detail) {
    //     await this.jobDetailRepository
    //       .createQueryBuilder()
    //       .update(JobDetailEntity)
    //       .set({ is_active: false })
    //       .where('sub_category_id = :id', { id: jobdetail.id })
    //       .execute();
    //   }
    // }

    return this.jobCategoryRepository
      .findOne({ where: { id: id } })
      .then((category) => {
        if (category) {
          this.jobCategoryRepository
            .createQueryBuilder()
            .update(JobCategoryEntity)
            .set({
              is_active: false,
            })
            .where('id = :id', { id: id })
            .execute();
          return { message: 'Category deactivated successfully' };
        } else {
          throw new HttpException('Category not found', 404);
        }
      });
  }

  async all(query: JobCategoryDTO) {
    let includeInactive = query.include_inactive;
    if (includeInactive != 'false' && includeInactive != 'true') {
      throw new HttpException('Invalid value for include_inactive', 400);
    }
    let page = query.page;
    let limit = query.limit;
    let whereActive = `is_active ${includeInactive == 'true' ? 'IS NOT NULL' : '= 1'} `;
    let sortBy = query.sortBy;
    let orderBy = query.orderBy;
    if (query.category_name) {
      const result = await this.jobCategoryRepository
        .createQueryBuilder()
        .select()
        .where('category LIKE :category_name', {
          category_name: `%${query.category_name}%`,
        })
        .andWhere(whereActive)
        .orderBy(sortBy, orderBy)
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      let count = result[1];
      let data = [];
      result[0].map((item) => {
        let created_at_str = item.created_at.toDateString();
        data.push({
          ...item,
          created_at_string: created_at_str,
        });
      });

      let statusCode = 200;
      return { statusCode, data, count };
    } else {
      const result = await this.jobCategoryRepository
        .createQueryBuilder()
        .select()
        .where(whereActive)
        .orderBy(sortBy, orderBy)
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();
      let count = result[1];
      let data = [];
      result[0].map((item) => {
        let created_at_str = item.created_at.toDateString();
        data.push({
          ...item,
          created_at_string: created_at_str,
        });
      });
      let statusCode = 200;
      return { statusCode, data, count };
    }
  }

  async findOne(id: number) {
    return this.jobCategoryRepository
      .findOne({ where: { id: id } })
      .then((category) => {
        if (category) {
          let statusCode = 200;
          return { statusCode, data: category };
        } else {
          throw new HttpException('Data not found', 404);
        }
      });
  }
}
