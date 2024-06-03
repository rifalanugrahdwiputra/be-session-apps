import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('mahasiswa')
export class MahasiswaEntity {
    @PrimaryGeneratedColumn('increment')
    nim: string;

    @Column()
    nama: string;

    @Column()
    program_studi: string;

    @Column()
    foto: string;

    @Column({ default: true })
    is_active: boolean;
} 