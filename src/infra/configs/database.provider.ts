import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import { config as dotenvConfig } from 'dotenv';
import { Logger, OnApplicationShutdown } from '@nestjs/common';

const ENV = process.env.NODE_ENV || 'dev';
dotenvConfig({ path: 'config/.dev.env' });
Logger.log(`DB_HOST: ${process.env.DB_HOST}`, 'DatabaseProvider');
const config = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'admin',
  entities: ["dist/**/*.entity.js"],
  migrations: ['dist/infra/*.js'],
  synchronize: false,
  dropSchema: false,
  migrationsRun: false,
  extra: {
    connectionLimit: 100
  }
}


export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource(config as DataSourceOptions);

      return dataSource.initialize();
    },
  },
];

export class DatabaseShutdownProvider implements OnApplicationShutdown {
  async onApplicationShutdown(signal?: string) {
    Logger.log('Shutting down database connection', 'DatabaseShutdownProvider');
    await connectionSource.destroy()
  }
}
