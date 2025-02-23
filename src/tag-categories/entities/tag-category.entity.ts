import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TagCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {
        unique: true
    })
    name: string;
}
