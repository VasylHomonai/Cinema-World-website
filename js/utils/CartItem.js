// Для отримання актуальної суми товара в корзині.
export class CartItem {
  constructor(id, quantity, price) {
    this.id = id;
    this.quantity = quantity;
    this.price = price;
  }

  setQuantity(newQuantity) {
    this.quantity = newQuantity;
  }

  getTotal() {
    return this.quantity * this.price;
  }
}
