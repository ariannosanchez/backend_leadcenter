import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Stage } from '../../stages/entities/stage.entity';

@Entity()
export class StageCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {
        unique: true
    })
    name:string;

    @OneToMany(
        () => Stage,
        (stage) => stage.stageCategory,
        { cascade: true }
    )
    stage: Stage[];
}
