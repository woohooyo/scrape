import { Mongo } from '../../lib/type';
import { EditableMongoAccessor } from '../editable-mongo-accessor';

export interface ICoupon {
  couponPrice?: number;
  remainingAmount?: number;
  totalAmount?: number;
  receivedAmount?: number;
}

export interface IProduct extends Mongo.IEditableRecord {
  batchId?: number;
  isTaoKeYi?: boolean;
  productId?: string;
  sellerId?: string;
  price?: number;
  isSellerCoupon?: boolean;
  title?: string;
  discountPrice?: number;
  salesVolume?: string;
  commissionPercent?: string;
  coupon?: ICoupon;
  taoBaoUrl?: string;
  activityId?: string;
}

export class Product extends EditableMongoAccessor<IProduct> {
  protected collectionName = 'product';
}
