import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { AuthEntity } from 'src/modules/auth/entity/auth.entity';

config();

class DbConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): any {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

    public getMongoConfig(): TypeOrmModuleOptions { 
      return {
        type: 'mongodb',
        host: this.getValue('MONGO_HOST'),
        port: parseInt(this.getValue('MONGO_PORT')),
        database: this.getValue('MONGO_DB'),
        username: this.env['MONGO_USER'],
        password: this.env['MONGO_PASS'],
        // entities: ['dist/**/*.entity.js'],
        entities: ['dist/modules/coords/entities/*.entity.js'],
        synchronize: true, // no usar en produccion, solo en desarrollo
      };
    }

  public getPostgresConfig(): TypeOrmModuleOptions { 
    return {
        type: 'postgres', 
        host: this.getValue('DB_HOST'), 
        port: parseInt(this.getValue('POSTGRES_PORT')),
        username: this.getValue('POSTGRES_USER'),
        password: this.getValue('POSTGRES_PASSWORD'),
        database: this.getValue('POSTGRES_DB'),
        // entities: ['dist/**/*.entity.js'], 
        entities: [],
        autoLoadEntities:true,
        synchronize: true, // no usar en produccion
        /*ssl: false,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          }
        }
        */
      };
  }

    public getMysqlConfig(): TypeOrmModuleOptions { 
    return {
        type: 'mysql', 
        host: this.getValue('MYSQL_DB_HOST'), 
        port: parseInt(this.getValue('MYSQL_PORT')),
        username: this.getValue('MYSQL_USER'),
        password: this.getValue('MYSQL_PASSWORD', false),
        database: this.getValue('MYSQL_DB'),
        entities: [AuthEntity], 
        autoLoadEntities:false,
        synchronize: false, // no usar en produccion
        /*ssl: false,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          }
        }
        */
      };
  }
}



const requiredEnvVars = [
  // 'DB_HOST',
  // 'POSTGRES_PORT',
  // 'POSTGRES_USER',
  // 'POSTGRES_PASSWORD',
  // 'POSTGRES_DB',
  // 'MONGO_HOST',
  // 'MONGO_PORT',
  // 'MONGO_DB',
  'MYSQL_DB_HOST',
  'MYSQL_PORT',
  'MYSQL_USER',
  // 'MYSQL_PASSWORD',
  'MYSQL_DB'
];

const dbConfigService = new DbConfigService(process.env).ensureValues(requiredEnvVars);

export { dbConfigService };
