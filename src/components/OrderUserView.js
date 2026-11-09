import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

const getStatusVariant = (status) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'processing': return 'info';
    case 'shipped': return 'primary';
    case 'delivered': return 'success';
    case 'cancelled': return 'danger';
    default: return 'secondary';
  }
};

const OrderUserView = ({ orders }) => {
  return (
    <div>
      <h2 className="mb-4">My Orders</h2>
      {orders.map(order => (
        <Card key={order._id} className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>Order #: {order._id}</span>
            <Badge bg={getStatusVariant(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </Card.Header>
          <Card.Body>
            <Card.Subtitle className="mb-3 text-muted">
              Ordered on: {new Date(order.orderedOn).toLocaleDateString()}
            </Card.Subtitle>

            <h5>Products:</h5>
            <ListGroup variant="flush">
              {order.productsOrdered.map(product => (
                <ListGroup.Item key={product._id}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{product.name}</strong><br />
                      <small>₱{product.price.toLocaleString()} each</small>
                    </div>
                    <div className="text-end">
                      {product.quantity} × ₱{product.price.toLocaleString()}<br />
                      <strong>₱{product.subtotal.toLocaleString()}</strong>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>

            <div className="mt-3 text-end">
              <h5>Total: ₱{order.totalPrice.toLocaleString()}</h5>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default OrderUserView;