import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  ObjectIdColumn
} from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('coords', { schema: 'geoapi' })
export class CoordsEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column('double precision', { name: 'lat', nullable: false })
  lat: number;

  @Column('double precision', { name: 'lng', nullable: false })
  lng: number;

  @CreateDateColumn({ name: 'timestamp', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
