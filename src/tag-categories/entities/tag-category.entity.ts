import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tag } from '../../tags/entities/tag.entity';

@Entity()
export class TagCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {
        unique: true
    })
    name: string;

    @OneToMany(
        () => Tag,(tag) => tag.tagCategory,
        { cascade: true }
    )
    tag: Tag[];
}
