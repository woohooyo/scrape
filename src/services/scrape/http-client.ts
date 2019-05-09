import Axios from 'axios';

export class HttpClient {
  private pages: string[] = [];
  private currentPage = 1;
  private totalPage = 1;

  public async fetch() {
    do {
      const page = await this.getProductListPage();
      this.pages.push(page);
      this.setNextPage();
    } while (!this.isLastPage());
    return this.pages;
  }

  private async getProductListPage() {
    const response =  await Axios.get('http://www.dataoke.com/qlist');
    return response.data;
  }

  private isLastPage() {
    return this.currentPage > this.totalPage;
  }

  private setNextPage() {
    if (this.currentPage <= this.totalPage) { this.currentPage++; }
  }
}
