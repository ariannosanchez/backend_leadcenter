import { IsString, MinLength } from "class-validator";

export class CreateStateCategoryDto {

    @IsString()
    @MinLength(1)
    name: string;
}
