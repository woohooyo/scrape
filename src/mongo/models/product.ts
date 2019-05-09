import { Mongo } from '../../lib/type';
import { EditableMongoAccessor } from '../editable-mongo-accessor';

export interface ICoupon {
  discountPrice?: number;
  remainingAmount?: number;
  totalAmount?: number;
  conditionPrice?: number;
}

export interface IProduct extends Mongo.IEditableRecord {
  title?: string;
  price?: number;
  salesVolume?: number;
  commissionPercent?: number;
  coupon?: ICoupon;
}

export class Product extends EditableMongoAccessor<IProduct> {
  protected collectionName = 'product';
}
