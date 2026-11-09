// AddToCart.js
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

/**
 * Add product to cart by making a POST request.
 * @param {Object} params
 * @param {string} params.productId - ID of the product to add
 * @param {number} params.quantity - Quantity to add
 * @param {number} params.price - Price of the product
 * @param {string} [params.token] - Optional auth token (if using JWT)
 * @returns {Promise<boolean>} - Success status
 */
export const addToCart = async ({ productId, quantity, price, token }) => {
  if (!token) {
    notyf.dismissAll();  // 🔥 Dismiss existing toasts
    notyf.error('You must be logged in to add items to the cart.');
    return false;
  }

  try {
    const subtotal = quantity * price;

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity, subtotal })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add to cart');
    }

    notyf.dismissAll();  // 🔥 Dismiss before success
    notyf.success('Item added to cart!');
    return true;

  } catch (error) {
    notyf.dismissAll();  // 🔥 Dismiss before error
    notyf.error(`Failed to add to cart: ${error.message}`);
    return false;
  }
};