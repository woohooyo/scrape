import { Mongo } from '../../lib/type';
import { EditableMongoAccessor } from '../editable-mongo-accessor';

export interface ILog extends Mongo.IEditableRecord {
  errorType?: 'Info'| 'Warn' | 'Error';
  message: string;
  error?: Error;
  groupId?: string;
}

export class Log extends EditableMongoAccessor<ILog> {
  protected collectionName = 'log';
}
