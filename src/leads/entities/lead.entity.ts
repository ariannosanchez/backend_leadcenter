import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column('text',{
        nullable: true
    })
    email: string;

    @Column('text')
    phone: string;

    @Column('text', {
        unique: true
    })
    slug: string;
}
