
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logtw')
export class LogTwEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    time: Date;

    @Column()
    user: String;

    @Column()
    ipaddress: String;

    @Column()
    information: String;
}