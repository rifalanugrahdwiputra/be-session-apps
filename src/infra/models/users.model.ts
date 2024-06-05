import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail } from "class-validator";

class UsersModelUpdate {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'Email',
        type: String,
        required: true,
        example: 'jhon@gmail.com'
    })
    email: string;

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
        description: 'Alamat',
        type: String,
        required: true,
        example: 'Jl.Paledang'
    })
    alamat: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Telp',
        type: String,
        required: true,
        example: '0893884732938'
    })
    telp: string;
}

class UsersModelCreate {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'Email',
        type: String,
        required: true,
        example: 'jhon@gmail.com'
    })
    email: string;

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
        description: 'Alamat',
        type: String,
        required: true,
        example: 'Jl.Paledang'
    })
    alamat: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Telp',
        type: String,
        required: true,
        example: '0893884732938'
    })
    telp: string;
}

class ChangePassword {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'Password New',
        type: String,
        required: true,
        example: 'admin123'
    })
    password: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'Verify Password',
        type: String,
        required: true,
        example: 'admin123'
    })
    passwordVerify: string;
}

export { UsersModelUpdate, UsersModelCreate, ChangePassword }
