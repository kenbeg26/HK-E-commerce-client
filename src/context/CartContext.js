import { createContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
	const [cartItems, setCartItems] = useState([]);

	const addToCart = (product, quantity = 1) => {
		setCartItems(prev => {
			const existing = prev.find(item => item._id === product._id);
			if (existing) {
				return prev.map(item =>
					item._id === product._id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			}
			return [...prev, { ...product, quantity }];
		});
	};

	const updateQuantity = (productId, newQuantity) => {
		if (newQuantity < 1) return;
		setCartItems(prev =>
			prev.map(item =>
				item._id === productId ? { ...item, quantity: newQuantity } : item
			)
		);
	};

	const removeFromCart = (productId) => {
		setCartItems(prev => prev.filter(item => item._id !== productId));
	};

	const clearCart = () => {
		setCartItems([]);
	};

	return (
		<CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
			{children}
		</CartContext.Provider>
	);
}

export default CartContext;
