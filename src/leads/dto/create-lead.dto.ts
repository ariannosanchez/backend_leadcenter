import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateLeadDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    phone: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsNotEmpty()
    tag: number;

    @IsInt()
    @IsNotEmpty()
    stage: number;
}
