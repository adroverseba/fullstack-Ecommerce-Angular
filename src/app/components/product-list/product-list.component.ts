import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string = '';
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyWord: string = '';

  // ActivatedRoute en el contructor es necesario para acceder al paremeter id
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  updatePageSize(value: string) {
    this.thePageSize = +value;
    this.thePageNumber = 1;
    this.listProducts();
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyWord = this.route.snapshot.paramMap.get('keyword')!;

    // if we have a different keyword than previous
    // then set thePageNumber to 1
    if (this.previousKeyWord != theKeyWord) {
      this.thePageNumber = 1;
      this.previousKeyWord = theKeyWord;
    }

    //now search for the products using keyword
    this.productService
      .searchProducts(theKeyWord, this.thePageNumber - 1, this.thePageSize)
      .subscribe(this.processResult());
  }

  handleListProducts() {
    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!; //paramMap.get('id')! -> this is the non-null assertion operator
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'book';
    }

    //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // if we have a different category id than previous
    // then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
      this.previousCategoryId = this.currentCategoryId;
    }

    //! DEBBUGGIN
    console.log(
      `currentCategotyId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`
    );

    //now get the products for the given category id
    //   this.productService
    //     .getProductList(this.currentCategoryId)
    //     .subscribe((data) => (this.products = data));

    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.products = data.content;
      this.thePageNumber = data.pageNo + 1;
      this.thePageSize = data.pageSize;
      this.theTotalElements = data.totalElements;
    };
  }

  addToCard(product: Product) {
    console.log(`Adding to cart: ${product.name}, $${product.unitPrice}`);

    const theCartItem = new CartItem(product);

    this.cartService.addToCart(theCartItem);
  }
}
