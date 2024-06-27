import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StageCategory } from '../../stage-categories/entities/stage-category.entity';
import { Lead } from '../../leads/entities/lead.entity';

@Entity()
export class Stage {

   @PrimaryGeneratedColumn()
   id: number;

   @Column('text', {
      unique: true
   })
   name: string;

   @ManyToOne(
      () => StageCategory,
      (stageCategory) => stageCategory.id, {
      eager: true
   })
   stageCategory: StageCategory


   @OneToMany(
      () => Lead,
      (lead) => lead.stage, {
      cascade: true
   })
   lead: Lead[];

}
