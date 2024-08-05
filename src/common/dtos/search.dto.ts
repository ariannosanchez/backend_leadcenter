import { Transform, Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class SearchDto {

    @IsOptional()
    @Type(() => Date)
    @Transform(({ value }) => {
        const date = new Date(value);
        date.setHours(0, 0, 0, 0);
        return date;
    }, { toClassOnly: true })
    startDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @Transform(({ value }) => {
        const date = new Date(value);
        date.setHours(23, 59, 59, 999);
        return date;
    }, { toClassOnly: true })
    endDate?: Date;

    @IsOptional()
    @Type(() => String)
    name: string;

    @IsOptional()
    @Type(() => String)
    lastName: string;

    @IsOptional()
    @Type(() => String)
    phone: string;

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    stageId: number;

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    tagId: number;

    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;
}