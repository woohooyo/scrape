import Axios from 'axios';
import * as Cheerio from 'cheerio';

export class HttpClient {
  private pages: string[] = [];
  private currentPage = 1;
  private totalPage = 1;

  public async fetch() {
    let retry = 0;
    try {
      do {
        const page = await this.getProductListPage();
        this.pages.push(page);
        this.setTotalPage(page);
        this.setNextPage();
      } while (!this.isLastPage());
      return this.pages;
    } catch (error) {
      if (retry < 3) {
        retry ++;
        await this.fetch();
      }
      throw error;
    }
  }

  public async getCopywritingPage(productId: string) {
    let retry = 0;
    try {
      const response = await Axios.get(`http://www.dataoke.com/gettpl?gid=${productId}`);
      return response.data;
    } catch (error) {
      if (retry < 3) {
        retry ++;
        await this.fetch();
      }
      throw error;
    }
  }

  public async getTaoKeYiData(couponUrl: string) {
    let retry = 0;
    try {
      const response = await Axios.post(
        'https://www.tkeasy.com/Interface/search',
        {
          keyword: couponUrl,
          groupid: 0,
        },
      );
      return response.data;
    } catch (error) {
      if (retry < 3) {
        retry ++;
        await this.fetch();
      }
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

  private isLastPage() {
    return this.currentPage > this.totalPage;
  }

  private setNextPage() {
    if (this.currentPage <= this.totalPage) { this.currentPage++; }
  }
}
