import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TagCategory } from '../../tag-categories/entities/tag-category.entity';
import { Lead } from '../../leads/entities/lead.entity';

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {
        unique: true
    })
    name: string;

    @ManyToOne(
        () => TagCategory, (tagCategory) => tagCategory.tag, {
        eager: true
    })
    tagCategory: TagCategory;

    @OneToMany(
        () => Lead, (lead) => lead.tag,
        { cascade: true }
    )
    lead: Lead[];
}
