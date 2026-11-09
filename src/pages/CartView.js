import { useContext } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CartContext from '../context/CartContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default function CartView() {
    const { cartItems, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

    const getTotal = () => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleCheckout = () => {
        notyf.success(`Order placed successfully! Total: ₱${getTotal().toFixed(2)}`);
        clearCart();
    };

    const handleRemoveItem = (itemId, itemName) => {
        removeFromCart(itemId);
        notyf.error(`${itemName} removed from cart`);
    };

    const handleClearCart = () => {
        clearCart();
        notyf.error('Cart cleared');
    };

    const handleQuantityChange = (itemId, newQuantity, itemName) => {
        updateQuantity(itemId, newQuantity);
        notyf.success(`${itemName} quantity updated to ${newQuantity}`);
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4">Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <Link to={`/products/${item._id}`}>{item.name}</Link>
                                    </td>
                                    <td>₱{item.price.toFixed(2)}</td>
                                    <td>
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            onClick={() => handleQuantityChange(item._id, item.quantity - 1, item.name)} 
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </Button>{' '}
                                        <span>{item.quantity}</span>{' '}
                                        <Button 
                                            variant="secondary" 
                                            size="sm" 
                                            onClick={() => handleQuantityChange(item._id, item.quantity + 1, item.name)}
                                        >
                                            +
                                        </Button>
                                    </td>
                                    <td>₱{(item.price * item.quantity).toFixed(2)}</td>
                                    <td>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => handleRemoveItem(item._id, item.name)}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <h4 className="text-end">Total: ₱{getTotal().toFixed(2)}</h4>
                    <div className="d-flex gap-2 mt-3">
                        <Button variant="success" onClick={handleCheckout}>
                            Checkout
                        </Button>
                        <Button variant="danger" onClick={handleClearCart}>
                            Clear Cart
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
}