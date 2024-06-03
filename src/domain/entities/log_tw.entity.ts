
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logtw')
export class LogTwEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn({ type: 'timestamp' })
    time: Date;

    @Column()
    user: string;

    @Column()
    ipaddress: string;

    @Column({ type: 'text' })
    information: string;
}