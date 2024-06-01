import { IsString, MinLength } from "class-validator";

export class CreateTagCategoryDto {

    @IsString()
    @MinLength(1)
    name:string;
}
