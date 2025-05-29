import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { AuthEntity } from "./auth.entity";
import { RoleEntity } from "./role.entity";

@Entity("model_has_roles")
export class ModelHasRolesEntity {
  @PrimaryColumn({ name: "model_id" }) // ID del usuario
  userId: number;

  @PrimaryColumn({ name: "role_id" }) // ID del rol
  roleId: number;

  @ManyToOne(() => AuthEntity, user => user.userRoles)
  @JoinColumn({ name: "model_id" })
  user: AuthEntity;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: "role_id" })
  role: RoleEntity;
}
