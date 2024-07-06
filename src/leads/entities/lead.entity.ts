import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Tag } from '../../tags/entities/tag.entity';
import { User } from '../../auth/entities/user.entity';
import { Stage } from '../../stages/entities/stage.entity';

@Entity()
export class Lead {

    @ApiProperty({
        example: '975142cd-c518-4e2a-a9f5-8265ae8249fa',
        description: 'Lead ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'John',
        description: 'Lead Name',
    })
    @Column('text')
    name: string;

    @ApiProperty({
        example: 'Doe',
        description: 'Lead Last Name',
    })    
    @Column('text', {
        nullable: true
    })
    lastName: string;

    @ApiProperty({
        example: 'johndoe@example.com',
        description: 'Lead Email',
    })
    @Column('text', {
        nullable: true
    })
    email: string;

    @ApiProperty({
        example: '5199999999',
        description: 'Lead Phone',
    })
    @Column('text')
    phone: string;

    @ApiProperty({
        example: 'john_doe',
        description: 'Lead Slug',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty()
    @ManyToOne(
        () => Tag, (tag) => tag.lead,
        { eager: true }
    )
    tag: Tag;

    @ApiProperty()
    @ManyToOne(
        () => Stage, (stage) => stage.lead,
        // { eager: true }
    )
    stage: Stage;

    @ManyToOne(
        () => User,
        (user) => user.lead,
        { eager: true }
    )
    user: User;
}