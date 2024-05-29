import { Injectable } from "@nestjs/common";
import { CreateCategory } from "../models/jobCategories.model";

@Injectable()
export class JobsCategoryRepository {


    async create(body: CreateCategory) {
        return ""
    }

}