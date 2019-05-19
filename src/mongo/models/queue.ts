import { Mongo } from '../../lib/type';
import { EditableMongoAccessor } from '../editable-mongo-accessor';

export interface IQueue extends Mongo.IEditableRecord {
  key: string;
  value?: string;
}

export class Queue extends EditableMongoAccessor<IQueue> {
  protected collectionName = 'queue';
}
