import { Mongo } from '../../lib/type';
import { EditableMongoAccessor } from '../editable-mongo-accessor';
export interface IErrorMessage {
  stack: string;
  name: string;
  message: string;
}
export interface ILog extends Mongo.IEditableRecord {
  errorType?: 'Info'| 'Warn' | 'Error';
  message: string;
  error?: IErrorMessage;
  groupId?: string;
}

export class Log extends EditableMongoAccessor<ILog> {
  protected collectionName = 'log';
}
