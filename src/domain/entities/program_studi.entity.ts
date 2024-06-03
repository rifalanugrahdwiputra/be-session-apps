
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('program_studi')
export class ProgramStudiEntity {
    @PrimaryGeneratedColumn('increment')
    kode: string;

    @Column()
    program_studi: string;

    @Column()
    kaprodi: string;

    @Column()
    nidn_kaprodi: string;

    @Column({ default: true })
    is_active: boolean;

}