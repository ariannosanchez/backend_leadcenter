import { IsString, MinLength } from "class-validator";

export class CreateStageCategoryDto {

    @IsString()
    @MinLength(1)
    name: string;
}
