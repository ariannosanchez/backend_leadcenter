import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class SearchDto {

    @ApiProperty({
        default: 10,
        description: 'How many rows do you need',
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        default: 0,
        description: 'How many rows do you want to skip',
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;

    @ApiProperty({
        description: 'Filter by Tag ID',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    tagId?: number;

    @ApiProperty({
        description: 'Filter by Stage ID',
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    stageId?: number;

    @ApiProperty({
        description: 'Start date for filtering',
        required: false,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;

    @ApiProperty({
        description: 'End date for filtering',
        required: false,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;
}