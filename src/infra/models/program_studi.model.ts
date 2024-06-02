import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

class CreateProgramStudi {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Kode',
        type: String,
        required: true,
        example: 'PS-001'
    })
    kode: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Program Studi',
        type: String,
        required: true,
        example: 'Teknik Informatika'
    })
    program_studi: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Kaprodi',
        type: String,
        required: true,
        example: 'Jhin Doe'
    })
    kaprodi: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'NIDN Kaprodi',
        type: String,
        required: true,
        example: 'KP-001'
    })
    nidn_kaprodi: string;
}

export { CreateProgramStudi }
