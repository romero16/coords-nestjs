import {
    Column,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    OneToMany,
  } from "typeorm";

  import { ModelHasRolesEntity } from "./model.has.roles.entity";
  
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

    // @Column({ name: 'active', type: 'boolean' })
    // active: boolean;

    // @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
    // deleted_at: Date | null;

      
    @OneToMany(() => ModelHasRolesEntity, modelHasRole => modelHasRole.user)
    userRoles: ModelHasRolesEntity[];
      
  }

