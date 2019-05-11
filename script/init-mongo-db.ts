import 'dotenv/config';
import { Db, MongoClient } from 'mongodb';

process.on('unhandledRejection', e => { throw e; });

const addDBAccount = async (adminDb: Db, userName, password, dbName) => {
  await adminDb.addUser(userName, password, {
    roles: [
      { role: 'readWrite', db: dbName },
    ],
  });
};

(async () => {
  const connectionString = `mongodb://${process.env.MONGO_CONFIG_ADMIN_USERNAME}:` +
    `${encodeURIComponent(process.env.MONGO_CONFIG_ADMIN_PASSWORD)}@${process.env.MONGO_CONFIG_HOST}:` +
    `${process.env.MONGO_CONFIG_PORT}`;
  console.log(`Connecting to database: ${connectionString}`);
  const dbClient = await MongoClient.connect(connectionString);
  try {
    // Create db user
    const db = dbClient.db(process.env.MONGO_CONFIG_DBNAME);
    await addDBAccount(db, process.env.MONGO_CONFIG_USERNAME,
      process.env.MONGO_CONFIG_PASSWORD, process.env.MONGO_CONFIG_DBNAME);
    console.log(`User is created for db ${process.env.MONGO_CONFIG_DBNAME}`);

    console.log('Init dev database done');
  } catch (error) {
    console.log(`Failed to create user, error is ${error.message}`);
  } finally {
    console.log('Closing database connection');
    await dbClient.close();
  }
})();
