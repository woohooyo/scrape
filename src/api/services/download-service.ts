import { createObjectCsvStringifier } from 'csv-writer';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IProduct } from '../../mongo/models/product';

export class DownloadService {

  public static async downloadExcel(products: IProduct[]) {
    const data = _.map(products as any[], (product) => {
      product.couponPrice = product.coupon.couponPrice;
      product.receivedAmount = product.coupon.receivedAmount;
      product.totalAmount = product.coupon.totalAmount;
      product.remainingAmount = product.coupon.remainingAmount;
      product.isSellerCoupon = product.isSellerCoupon ? '是' : '否';
      product.isTaoKeYi = product.isTaoKeYi ? '是' : '否';
      product.createdAt = moment(product.createdAt).format('YYYY/MM/DD hh:mm:ss');
      return product;
    });

    const csvWriter = createObjectCsvStringifier({
      header: [
        {id: 'isTaoKeYi', title: '大淘客'},
        {id: 'title', title: '产品名称'},
        {id: 'taoBaoUrl', title: '淘宝链接'},
        {id: 'price', title: '原价'},
        {id: 'isSellerCoupon', title: '店铺券'},
        {id: 'couponPrice', title: '优惠券价格'},
        {id: 'discountPrice', title: '券后价'},
        {id: 'receivedAmount', title: '已领取券数'},
        {id: 'totalAmount', title: '总券数'},
        {id: 'remainingAmount', title: '剩余券数'},
        {id: 'salesVolume', title: '销量'},
        {id: 'commissionPercent', title: '佣金比例'},
      ],
    });
    return csvWriter.getHeaderString() + csvWriter.stringifyRecords(data);
  }
}
