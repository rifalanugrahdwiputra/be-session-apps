
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('program_studi')
export class ProgramStudiEntity {
    @PrimaryGeneratedColumn('increment')
    kode: string;

    @Column()
    program_studi: string;

    @Column()
    kaprodi: String;

    @Column()
    nidn_kaprodi: String;

    @Column()
    is_active: Boolean;

}