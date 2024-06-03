import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { State } from '../../state/entities/state.entity';

@Entity()
export class StateCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {
        unique: true
    })
    name: string;

    @OneToMany(
        () => State,
        (state) => state.stateCategory,
        { cascade: true }
    )
    state: State[];
}
