import * as _ from 'lodash';
import { CollectionInsertOneOptions, FilterQuery, MongoClient, OrderedBulkOperation, ReplaceOneOptions } from 'mongodb';
import { Config, Mongo } from '../lib/type';
import { MongoAccessor } from './mongo-accessor';

export class EditableMongoAccessor<T extends Mongo.IEditableRecord> extends MongoAccessor<T> {
  private operator: string;

  constructor(mongoConfig: Config.IConfigMongo, mongoClient?: MongoClient) {
    super(mongoConfig, mongoClient);
  }

  public initOperator(operator: string) {
    this.operator = operator;
  }

  public async insertOne(fullDoc: T, bulkOps?: OrderedBulkOperation, options?: CollectionInsertOneOptions) {
    if (_.isNil(fullDoc.createdBy) && _.isNil(this.operator)) {
      throw new Error('Missing createdBy!');
    }
    if (_.isNil(fullDoc.createdBy)) { fullDoc.createdBy = this.operator; }
    fullDoc.isDeleted = false;
    fullDoc.createdAt = new Date();
    return await super.insertOne(fullDoc, bulkOps, options);
  }

  public async updateOne(doc: T, query: FilterQuery<T>, bulkOps?: OrderedBulkOperation, options?: ReplaceOneOptions) {
    if (_.isNil(doc.updatedBy) && _.isNil(this.operator)) {
      throw new Error('Missing updatedBy!');
    }
    if (_.isNil(doc.updatedBy)) { doc.updatedBy = this.operator; }
    doc.updatedAt = new Date();
    return await super.updateOne(doc, query, bulkOps, options);
  }

  public async softDeleteOne(query: FilterQuery<T>, bulkOps?: OrderedBulkOperation, options?: ReplaceOneOptions) {
    if (_.isNil(this.operator)) {
      throw new Error('Missing updatedBy!');
    }
    return await super.updateOne({
      isDeleted: true,
      updatedAt: new Date(),
      updatedBy: this.operator,
    } as T, query, bulkOps, options);
  }
}
