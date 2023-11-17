import { MongooseModule } from "@nestjs/mongoose"

require('dotenv').config();

const dbHost = process.env.MONGODB_HOST || 'localhost';
const dbPort = process.env.MONGODB_PORT || '27017';
const dbUser = process.env.MONGODB_USERNAME || '';
const dbPassword = process.env.MONGODB_PASSWORD || '';
const dbName = process.env.MONGODB_DATABASE || 'private-gpt-manager';

export const DbModule = MongooseModule.forRoot(
  `mongodb://${dbHost}:${dbPort}`,
  {
    user: dbUser,
    pass: dbPassword,
    dbName: dbName
  }
);