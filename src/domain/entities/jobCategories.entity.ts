
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('job_categories')
export class JobCategoryEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column({length: 100})
    category: string;

    @Column({default: true})
    is_active: boolean; 
    
    @CreateDateColumn( {type: 'timestamp'})
    created_at: Date;

}