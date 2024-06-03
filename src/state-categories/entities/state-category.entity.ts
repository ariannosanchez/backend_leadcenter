import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class StateCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {
        unique: true
    })
    name: string;
}
