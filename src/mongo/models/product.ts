import { Mongo } from '../../lib/type';
import { EditableMongoAccessor } from '../editable-mongo-accessor';

export interface ICoupon {
  couponPrice?: number;
  remainingAmount?: number;
  totalAmount?: number;
}

export interface IProduct extends Mongo.IEditableRecord {
  isTaoKeYi?: boolean;
  productId?: string;
  title?: string;
  discountPrice?: number;
  salesVolume?: string;
  commissionPercent?: string;
  coupon?: ICoupon;
}

export class Product extends EditableMongoAccessor<IProduct> {
  protected collectionName = 'product';
}
