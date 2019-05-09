import 'dotenv/config';
import { Config } from '../lib/type';

export const jwtConfig: Config.IJwtConfig = {
  key: process.env.JWT_PRIVATE_KEY,
  expire: process.env.JWT_EXPIRE,
};

export const mongoConfig: Config.IConfigMongo = {
  mongoHost: process.env.MONGO_CONFIG_HOST,
  mongoUsername: process.env.MONGO_CONFIG_USERNAME,
  mongoPassword: process.env.MONGO_CONFIG_PASSWORD,
  mongoPort: process.env.MONGO_CONFIG_PORT,
  mongoDbName: process.env.MONGO_CONFIG_DBNAME,
  mongoOptions: { useNewUrlParser: true, poolSize: 50 },
  mongoUseDnsSeedlist: process.env.MONGO_USE_DNS_SEED_LIST === 'true',
};

export const jwtIncludeRoutes: string[] = [
  '/api/product/',
];
