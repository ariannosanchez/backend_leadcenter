import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StateCategory } from '../../state-categories/entities/state-category.entity';

@Entity()
export class State {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {
        unique: true
    })
    name: string;

    @ManyToOne(
        () => StateCategory, (stateCategory) => stateCategory.id, {
        eager: true
    })
    stateCategory: StateCategory;
}
