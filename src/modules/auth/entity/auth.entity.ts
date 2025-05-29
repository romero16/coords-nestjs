import {
    Column,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn
  } from "typeorm";
  
  @Entity("users" /*, { schema: "romero" }*/)
  export class AuthEntity {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;
  
    @Column({ name: "name" })
    name:string;
  
    @Column({ name: 'password', select: true })
    password:string;

    @Column({ name: 'email' })
    email:string;

    @Column({ name: 'role' })
    role:string;

    @Column({ name: 'status' })
    status: string;
  
  }