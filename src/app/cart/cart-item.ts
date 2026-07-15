import { Product } from '../products/product';

export interface CartItem {
  product: Product;
  quantity: number;
}
