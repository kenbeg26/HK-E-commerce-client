
import React, { useState, useEffect, useContext, useCallback } from 'react';
import UserContext from '../context/UserContext';
import OrderAdminView from '../components/OrderAdminView';
import OrderUserView from '../components/OrderUserView';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = useContext(UserContext);

  const fetchOrders = useCallback(async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      const endpoint = user?.isAdmin
        ? '/orders/all-orders'
        : '/orders/my-orders';

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}${endpoint}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setError(null);

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);

      if (err.message.includes('Unauthorized') || err.message.includes('token')) {
        // Handle token expiration or invalid token
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  if (loading) return (
    <Container className="mt-4 text-center">
      <Spinner animation="border" role="status" />
      <p>Loading orders...</p>
    </Container>
  );

  return (
    <Container className="mt-4">
      {error && (
        <Alert variant="danger">
          Error: {error}
          <div className="mt-2">
            <Button variant="primary" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {!error && orders.length === 0 && (
        <Alert variant="info">
          {user?.isAdmin ? 'No orders in system' : 'You have no orders yet'}
        </Alert>
      )}

      {!error && orders.length > 0 && (
        user?.isAdmin ? (
          <OrderAdminView orders={orders} />
        ) : (
          <OrderUserView orders={orders} />
        )
      )}
    </Container>
  );
};

export default Order;
