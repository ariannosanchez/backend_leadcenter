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

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    createdAt?: Date;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    tag: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    stage: number;
}
