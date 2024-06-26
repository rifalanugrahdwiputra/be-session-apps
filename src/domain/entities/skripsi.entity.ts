import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('skripsi')
export class SkripsiEntity {
    @PrimaryGeneratedColumn('increment')
    id: Number

    @Column()
    nim: string

    @Column()
    pembimbing: string

    @Column()
    penguji1: string

    @Column()
    penguji2: string

    @CreateDateColumn()
    tanggal_daftar: Date

    @CreateDateColumn()
    tanggal_sidang: Date

    @Column()
    ruang_sidang: string

    @Column()
    nilai_pembimbing: string

    @Column()
    nilai_penguji1: string

    @Column()
    nilai_penguji2: string

    @Column()
    nilai_akhir: string

    @Column({ type: 'text' })
    keterangan: string

    @Column({ default: true })
    is_active: boolean;
}