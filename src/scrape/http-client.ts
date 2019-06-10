import Axios from 'axios';
import * as Cheerio from 'cheerio';
import { Logger } from '../lib/logger';

export class HttpClient {
  private pages: string[] = [];
  private currentPage = 1;
  private totalPage = 1;
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public isLastPage() {
    return this.currentPage > this.totalPage;
  }

  public async fetch(retry: number = 0) {
    try {
      this.pages = [];
      do {
        const page = await this.getProductListPage();
        this.pages.push(page);
        this.setTotalPage(page);
        this.setNextPage();
      } while (!this.isLastPage() && this.currentPage % 100 !== 0);
      return this.pages;
    } catch (error) {
      if (retry < 3) {
        retry ++;
        await this.logger.warn(`Get dataoke page retry: ${retry}`, error);
        await new Promise(resolve => setTimeout(resolve, 100 * retry));
        await this.fetch(retry);
      }
      await this.logger.error('Get dataoke page error', error);
      throw error;
    }
  }

  public async getCopywritingPage(productId: string, retry = 0) {
    try {
      const response = await Axios.get(`http://www.dataoke.com/gettpl?gid=${productId}`);
      return response.data;
    } catch (error) {
      if (retry < 3) {
        retry ++;
        await this.logger.warn(`Get product[${productId}] copywriting page retry: ${retry}`, error);
        await new Promise(resolve => setTimeout(resolve, 100 * retry));
        await this.getCopywritingPage(productId, retry);
      }
      await this.logger.error(`Get product[${productId}] copywriting page error`, error);
      throw error;
    }
  }

  public async getTaoKeYiData(couponUrl: string, retry = 0) {
    try {
      const response = await Axios.get(
        // tslint:disable-next-line:max-line-length
        `http://taokeyi.com/find?count=0&findObj%5BfindType%5D=1&findObj%5Bj_url%5D=${encodeURIComponent(couponUrl)}&findObj%5BfindBigType%5D%5Bfind_wxwAn%5D=false&findObj%5BfindBigType%5D%5Bfind_ysj%5D=false&findObj%5BfindBigType%5D%5Bfind_tqg%5D=true&findObj%5BfindBigType%5D%5Bfind_jhs%5D=true&findObj%5BfindBigType%5D%5Bfind_rcd%5D=true&findObj%5BfindBigType%5D%5Bfind_gyd%5D=true&findObj%5BfindBigType%5D%5Bfind_yg%5D=true&findObj%5BfindQAll%5D=true`,
      );
      if (/error/i.test(response.data.msg)) { throw new Error(response.data.msg); }
      return response.data;
    } catch (error) {
      if (retry < 3) {
        retry ++;
        await this.logger.warn(`Get coupon[${couponUrl}] taokeyi data retry: ${retry}`, error);
        await new Promise(resolve => setTimeout(resolve, 100 * retry));
        await this.getTaoKeYiData(couponUrl, retry);
      }
      await this.logger.error(`Get coupon[${couponUrl}] taokeyi data error`, error);
      throw error;
    }
  }

  private setTotalPage(page: string) {
    if (this.currentPage === 1) {
      const $ = Cheerio.load(page);
      const totalPage = $('select[name="page"] option').length;
      this.totalPage = totalPage;
    }
  }

  private async getProductListPage() {
    const response = await Axios.get(`http://www.dataoke.com/qlist?page=${this.currentPage}`);
    return response.data;
  }

  private setNextPage() {
    if (this.currentPage <= this.totalPage) { this.currentPage++; }
  }
}
