import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateMahasiswa {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'NIM',
        type: String,
        required: true,
        example: 2123011313
    })
    nim: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Nama Mahasiswa',
        type: String,
        required: true,
        example: 'test',
    })
    nama: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Prodi',
        type: String,
        required: true,
        example: 'Teknik Informatika',
    })
    program_studi: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Foto Mahasiswa',
        type: String,
        required: true,
        example: 'https://',
    })
    Foto: string
}