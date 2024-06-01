import { Column, PrimaryGeneratedColumn } from "typeorm";

export class TagCategory {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    name: string;
}
