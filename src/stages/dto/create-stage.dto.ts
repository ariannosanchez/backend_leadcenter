import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateStageDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    stageCategory: number;
}
