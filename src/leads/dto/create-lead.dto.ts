import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateLeadDto {

    @ApiProperty({
        description: 'Lead name',
        nullable: false,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        description: 'Lead last name',
        nullable: true
    })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    email?: string;

    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    tagId: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    stageId: number;
}
