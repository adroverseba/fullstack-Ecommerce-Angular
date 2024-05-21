import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  // Subject is a subclass of Observable, publish events in our code. The event will be sent to all of the subscribers
  totalPrices: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  addToCart(theCartItem: CartItem) {
    // check if we already have the item in our cart
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      existingCartItem = this.cartItems.find(
        (item) => item.id === theCartItem.id
      );
    }
    // check if i found it
    if (existingCartItem != undefined) {
      // increment de quantity
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }
    // compute cart total price and total quantity
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    //publish the new values ... all subscribers will receive the new data
    this.totalPrices.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //!log data just for debugging purposses
    this.logCartData(totalPriceValue, totalQuantityValue);

    // Calculate total price
    // Calculate total quantity
    //   let totals = this.cartItems.reduce(
    //     (acc, currentValue) => {
    //       acc.totalPriceValue += currentValue.unitPrice + currentValue.quantity;
    //       acc.totalQuantityValue += currentValue.quantity;
    //       return acc;
    //     },
    //     { totalPriceValue: 0, totalQuantityValue: 0 }
    //   );

    //   this.totalPrices.next(totals.totalPriceValue);
    //   this.totalQuantity.next(totals.totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Content of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity + tempCartItem.unitPrice;
      console.log(
        `name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`
      );
    }
    console.log(
      `totalPrice:${totalPriceValue.toFixed(
        2
      )}, totalQuantity=${totalQuantityValue}`
    );
    console.log('----');
  }
}
