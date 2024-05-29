import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

class CreateCategory {
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: 'Category name',
        type: String,
        required: true,
        example: 'Backend Developer'
    })
    category_name: string;
}

export {CreateCategory}
