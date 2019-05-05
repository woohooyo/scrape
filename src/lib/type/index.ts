import { MongoClientOptions, ObjectId } from 'mongodb';

export declare namespace Config {
  interface IConfigMongo {
    mongoHost: string;
    mongoUsername: string;
    mongoPassword: string;
    mongoPort: string;
    mongoDbName: string;
    mongoOptions?: MongoClientOptions;
    mongoUseDnsSeedlist: boolean;
  }

  interface IJwtConfig {
    key?: string;
    expire?: string;
  }
}

export declare namespace Mongo {
  interface IEditableRecord {
    _id?: ObjectId;
    isDeleted?: boolean;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
  }
}
