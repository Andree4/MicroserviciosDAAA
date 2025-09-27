import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Medico {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column()
  cedula_profesional!: string;

  @Column()
  especialidad!: string;

  @Column()
  años_de_experiencia!: number;

  @Column()
  correo!: string;
}
