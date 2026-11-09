import React from 'react';
import { Table, Badge, Card, Stack, Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';


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



const OrderAdminView = ({ orders }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const navigate = useNavigate();

  return (
    <div className="p-3">
      <Stack direction="horizontal" className="justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="mb-3 mb-md-0">All Orders (Admin View)</h2>
        <Button
          variant="secondary"
          onClick={() => navigate('/AdminDashboard')}
          className="ms-md-2"
        >
          Back to Dashboard
        </Button>

      </Stack>

      {isMobile ? (
        <div className="order-cards">
          {orders.map(order => (
            <Card key={order._id} className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between">
                  <span>Order ID: {order._id.substring(0, 8)}...</span>
                  <Badge bg={getStatusVariant(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  User ID: {order.userId.substring(0, 8)}...
                </Card.Subtitle>

                <div className="mb-3">
                  <h6 className="fw-bold">Products:</h6>
                  <ul className="list-unstyled">
                    {order.productsOrdered.map(product => (
                      <li key={product._id} className="mb-2 ps-2 border-start">
                        <strong>{product.name}</strong><br />
                        Qty: {product.quantity} × ₱{product.price?.toLocaleString?.() || '0'}<br />
                        Subtotal: ₱{product.subtotal?.toLocaleString?.() || '0'}
                      </li>
                    ))}
                  </ul>
                </div>

                <Stack direction="horizontal" className="justify-content-between">
                  <div>
                    <h6 className="fw-bold">Total:</h6>
                    <span>₱{order.totalPrice?.toLocaleString?.() || '0'}</span>
                  </div>
                  <div className="text-end">
                    <h6 className="fw-bold">Order Date:</h6>
                    <small>{order.orderedOn ? new Date(order.orderedOn).toLocaleDateString() : 'N/A'}</small>
                  </div>
                </Stack>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Products</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId}</td>
                <td>
                  <ul className="list-unstyled">
                    {order.productsOrdered.map(product => (
                      <li key={product._id} className="mb-2">
                        <strong>{product.name}</strong><br />
                        Qty: {product.quantity} × ₱{product.price?.toLocaleString?.() || '0'} = ₱{product.subtotal?.toLocaleString?.() || '0'}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>₱{order.totalPrice?.toLocaleString?.() || '0'}</td>
                <td>
                  <Badge bg={getStatusVariant(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </td>
                <td>{order.orderedOn ? new Date(order.orderedOn).toLocaleString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default OrderAdminView;