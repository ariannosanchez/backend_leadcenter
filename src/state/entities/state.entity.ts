import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StateCategory } from '../../state-categories/entities/state-category.entity';
import { Lead } from '../../leads/entities/lead.entity';

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

    @OneToMany(
        () => Lead, (lead) => lead.state,
        { cascade: true }
    )
    lead: Lead[];
}
