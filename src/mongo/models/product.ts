import { Mongo } from '../../lib/type';
import { EditableMongoAccessor } from '../editable-mongo-accessor';

export interface ICoupon {
  id?: string;
  couponPrice?: number;
  discontPrice?: number;
  endTime?: Date;
  remainingAmount?: number;
  receivedAmount?: number;
  conditionPrice?: number;
  phoneShortLink?: string;
  phoneLink?: string;
}

export interface IProduct extends Mongo.IEditableRecord {
  isDaTaoKe?: boolean;
  isTaoKeYi?: boolean;
  productId?: number;
  TaoBaoProductId?: number;
  detailUrl?: string;
  title?: string;
  subTitle?: string;
  image?: string;
  categoryId?: number;
  price?: number;
  isTianMao?: boolean;
  salesVolume?: number;
  score?: number;
  vendorId?: number;
  plannedCommission?: number;
  xxxxxxCommission?: number;
  planUrl?: string;
  planStatus?: boolean;
  copywriting?: string;
  coupon?: ICoupon;
}

export class Product extends EditableMongoAccessor<IProduct> {
  protected collectionName = 'product';
}
