import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tag } from '../../tags/entities/tag.entity';
import { State } from '../../state/entities/state.entity';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Lead {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text', {
        nullable: true
    })
    lastName: string;

    @Column('text', {
        nullable: true
    })
    email: string;

    @Column('text')
    phone: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @ManyToOne(
        () => Tag, (tag) => tag.lead,
        { eager: true }
    )
    tag: Tag;

    @ManyToOne(
        () => State, (state) => state.lead,
        { eager: true }
    )
    state: State;

    @ManyToOne(
        () => User,
        (user) => user.lead,
        { eager: true }
    )
    user: User;
}