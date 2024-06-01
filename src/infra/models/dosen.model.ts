import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

class CreateDosen {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'NIDN',
        type: String,
        required: true,
        example: 'DS-001'
    })
    nidn: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Nama Dosen',
        type: String,
        required: true,
        example: 'Jhon Doe'
    })
    nama: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Foto Dosen',
        type: String,
        required: true,
        example: 'https://'
    })
    foto: string;
}

export { CreateDosen }
