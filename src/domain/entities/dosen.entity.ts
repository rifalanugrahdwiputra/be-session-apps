
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dosen')
export class DosenEntity {
    @PrimaryGeneratedColumn('increment')
    nidn: string;

    @Column()
    nama: string;

    @Column()
    foto: string;

    @Column({ default: true })
    is_active: boolean;
}