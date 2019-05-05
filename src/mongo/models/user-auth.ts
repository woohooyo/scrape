import { Mongo } from '../../lib/type';
import { EditableMongoAccessor } from '../editable-mongo-accessor';

export interface IUserAuth extends Mongo.IEditableRecord {
  username?: string;
  password?: string;
}

export class UserAuth extends EditableMongoAccessor<IUserAuth> {
  protected collectionName = 'userAuth';
}
