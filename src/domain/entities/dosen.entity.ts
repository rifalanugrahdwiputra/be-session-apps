
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dosen')
export class DosenEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    nidn: string;

    @Column()
    nama: string;

    @Column()
    foto: String;

    @Column()
    is_active: Boolean;

}