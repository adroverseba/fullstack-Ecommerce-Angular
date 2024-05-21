import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable, map } from 'rxjs';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8081/api/v1/products';
  private categoryUrl = 'http://localhost:8081/api/v1/product-category';

  constructor(private httpClient: HttpClient) {}

  //todo: add pagination feature for category ID
  getProductListPaginate(
    pageNo: number,
    pageSize: number,
    categoryId: number
  ): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/categories/${categoryId}?pageNo=${pageNo}&pageSize=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl = this.baseUrl + '/categories/' + categoryId;
    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(this.categoryUrl);
  }

  searchProducts(
    theKeyWord: string,
    pageNumber: number,
    pageSize: number
  ): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search?name=${theKeyWord}&pageNo=${pageNumber}&pageSize=${pageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProduct(theProductId: number): Observable<Product> {
    const searchUrl = this.baseUrl + '/' + theProductId;
    return this.httpClient.get<Product>(searchUrl);
  }

  //refactor repetitive code
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(searchUrl);
  }
}

interface GetResponseProducts {
  content: Product[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
