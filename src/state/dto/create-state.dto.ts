import { IsInt, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateStateDto {
    @IsString()
    @MinLength(1)
    name: string;

    @IsInt()
    @IsOptional()
    stateCategory: number;

}
