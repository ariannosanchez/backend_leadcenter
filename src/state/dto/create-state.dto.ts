import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateStateDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    stateCategory: number;

}
