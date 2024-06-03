import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

class CreateLogTw {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'User',
        type: String,
        required: true,
        example: 'Admin'
    })
    user: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'IP Address',
        type: String,
        required: true,
        example: 'http://127.0.0.1'
    })
    ipaddress: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Information Log',
        type: String,
        required: true,
        example: 'User Admin Melakukan Login'
    })
    information: string;
}

export { CreateLogTw }
