import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      console.log("Token is available, fetching cart...");
      fetchCart();
    } else {
      console.warn("Token not found, user might not be logged in.");
      setLoading(false); // avoid spinner hang if no token
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      if (!token) {
        setError("User not authenticated");
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Token being sent:", token);

      if (!response.ok) {
        let errorMessage = 'Failed to load cart';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonErr) {
          console.warn("Could not parse error response:", jsonErr);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Cart data:', data);
      setCart(data);
    } catch (err) {
      console.error("fetchCart error:", err);
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    try {
      setUpdating(true);
      const item = cart.cartItems.find(i => i.productId === productId);
      if (!item) return;

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          newQuantity: newQty // match backend expected field
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quantity');
      }

      notyf.success('Quantity updated');
      fetchCart();
    } catch (err) {
      console.error(err);
      notyf.error(err.message);
    } finally {
      setUpdating(false);
    }
  };


  const deleteItem = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/remove-from-cart`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete item');

      notyf.success('Item removed');
      fetchCart();
    } catch (err) {
      notyf.error(err.message);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to clear cart');

      notyf.success('Cart cleared');
      fetchCart();
    } catch (err) {
      notyf.error(err.message);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!cart || cart.cartItems.length === 0) {
        notyf.error('Your cart is empty');
        return;
      }

      setUpdating(true);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.error?.includes('Product with ID') && responseData.error?.includes('not found')) {
          notyf.error('One or more products in your cart are no longer available. Please review your cart.');
          // Instead of refresh, just show message
        } else {
          throw new Error(responseData.error || responseData.message || 'Checkout failed');
        }
        return;
      }

      notyf.success(responseData.message || 'Order created successfully!');
      setCart({ ...cart, cartItems: [], totalPrice: 0 });

    } catch (err) {
      console.error('Checkout error:', err);
      notyf.error(err.message || 'An error occurred during checkout');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Loading cart...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">Your cart is empty.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Your Cart</h2>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Product Name</th>
            <th style={{ width: '120px' }}>Quantity</th>
            <th>Price</th>
            <th>Subtotal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.cartItems.map(item => (
            <tr key={item.productId}>
              <td>{item.name}</td>
              <td>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  disabled={updating}
                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                />
              </td>
              <td>₱{item.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
              <td>₱{item.subtotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteItem(item.productId)}
                  disabled={updating}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>

      </Table>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4>Total: ₱{cart.totalPrice?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') || '0.00'}</h4>
        <div>
          <Button variant="success" className="me-2" onClick={handleCheckout}>Checkout</Button>
          <Button variant="outline-danger" onClick={clearCart}>Clear Cart</Button>
        </div>
      </div>
    </Container>
  );
}