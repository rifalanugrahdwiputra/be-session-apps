
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    foto: string;

    @Column({ default: true })
    is_active: boolean;

}