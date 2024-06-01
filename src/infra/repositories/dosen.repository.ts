import { Injectable } from "@nestjs/common";
import { CreateDosen } from "../models/dosen.model";

@Injectable()
export class DosenRepository {


    async create(body: CreateDosen) {
        return ""
    }

}