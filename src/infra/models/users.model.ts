import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

class UsersModelUpdate {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Username',
        type: String,
        required: true,
        example: 'jhon'
    })
    username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Password New',
        type: String,
        required: true,
        example: '********'
    })
    password: string;

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

export { UsersModelUpdate }
