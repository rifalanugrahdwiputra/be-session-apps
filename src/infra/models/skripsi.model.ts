import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateSkripsi {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        description: 'id',
        type: Number,
        required: true,
        example: '100'
    })
    id: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'nim',
        type: String,
        required: true,
        example: '2113213123'
    })
    nim: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'pembimbing',
        type: String,
        required: true,
        example: '1231312'
    })

    pembimbing: string
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'penguji',
        type: String,
        required: true,
        example: '1231231'
    })
    penguji1: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'nim',
        type: String,
        required: true,
        example: '321314131'
    })
    penguji2: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'tanggal_daftar',
        type: String,
        required: true,
        example: '2024-06-02'
    })
    tanggal_daftar: Date

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'tanggal_sidang',
        type: String,
        required: true,
        example: '2024-06-7'
    })
    tanggal_sidang: Date

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'ruang_sidang',
        type: String,
        required: true,
        example: 'A'
    })
    ruang_sidang: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'nilai_pembimbing',
        type: String,
        required: true,
        example: '80'
    })
    nilai_pembimbing: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'nilai_penguji1',
        type: String,
        required: true,
        example: '90'
    })
    nilai_penguji1: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'nilai_penguji2',
        type: String,
        required: true,
        example: '100'
    })
    nilai_penguji2: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'nilai_akhir',
        type: String,
        required: true,
        example: '95'
    })
    nilai_akhir: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'keterangan',
        type: String,
        required: true,
        example: 'mantap'
    })
    keterangan: string
}