import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id : string;

    @Column('text')
    fullName : string;

    @Column('text', { unique: true })
    email : string;

    @Column('text', { select: false })
    password : string;
}
