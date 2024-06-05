import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    tagCategory: number;
}
