import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert, Row, Col, Form, Badge } from 'react-bootstrap';
import { Notyf } from 'notyf';
import { addToCart } from '../components/AddToCart';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [imageError, setImageError] = useState(false);

    const isLoggedIn = Boolean(localStorage.getItem('token'));

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                const productData = data.data || data;

                if (!productData.price) productData.price = 0;
                setProduct(productData);
            } catch (err) {
                setError(err.message);
                notyf.dismissAll();
                notyf.error(`Failed to load product: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;

        const token = localStorage.getItem('token');
        if (!token) {
            notyf.dismissAll();
            notyf.error("You must be logged in to add to cart.");
            setTimeout(() => navigate('/login'), 1000); // redirect after 1 second
            return;
        }

        const success = await addToCart({
            productId: product._id,
            quantity,
            price: product.price,
            token
        });

        if (success) {
            notyf.dismissAll();
            notyf.success(`${product.name} added to cart!`);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2
        }).format(price);
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading product details...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    <Alert.Heading>Error loading product</Alert.Heading>
                    <p>{error}</p>
                    <Link to="/products" className="btn btn-primary">Back to Products</Link>
                </Alert>
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="py-5">
                <Alert variant="warning">
                    <Alert.Heading>Product not found</Alert.Heading>
                    <p>The requested product could not be found.</p>
                    <Link to="/products" className="btn btn-primary">Back to Products</Link>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="shadow-sm border-0 overflow-hidden">
                        <Row className="g-0">
                            <Col md={6} className="p-3 bg-light">
                                <div className="position-relative" style={{ height: '400px', overflow: 'hidden' }}>
                                    <Card.Img
                                        variant="top"
                                        src={
                                            imageError
                                                ? 'https://via.placeholder.com/500x500?text=Image+Not+Available'
                                                : product.imageUrl || 'https://via.placeholder.com/500x500?text=Product+Image'
                                        }
                                        className="img-fluid rounded"
                                        style={{
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'contain',
                                            backgroundColor: '#f8f9fa'
                                        }}
                                        onError={() => setImageError(true)}
                                    />
                                    {product.isActive === false && (
                                        <Badge pill bg="danger" className="position-absolute top-0 start-0 m-2">
                                            Out of Stock
                                        </Badge>
                                    )}
                                </div>
                            </Col>

                            <Col md={6} className="p-4">
                                <Card.Body className="h-100 d-flex flex-column p-0">
                                    <Card.Title as="h2" className="mb-3 fw-bold">
                                        {product.name || 'No product name available'}
                                    </Card.Title>

                                    <Card.Text className="mb-4 fs-5 text-muted">
                                        {product.description || 'No description available'}
                                    </Card.Text>

                                    <div className="mb-4">
                                        <h3 className="text-primary fw-bold">{formatPrice(product.price)}</h3>
                                        <small className="text-muted">Inclusive of VAT</small>
                                    </div>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-bold">Quantity:</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={quantity}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            style={{ width: '100px' }}
                                            disabled={product.isActive === false}
                                        >
                                            {[...Array(product.isActive ? 100 : 1).keys()].map((num) => (
                                                <option key={num + 1} value={num + 1}>
                                                    {num + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>

                                    <div className="mt-auto">
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="w-100 mb-3 py-3 fw-bold fs-5"
                                            onClick={handleAddToCart}
                                            disabled={!isLoggedIn || product.isActive === false}
                                        >
                                            {!isLoggedIn
                                                ? 'Login to Add to Cart'
                                                : product.isActive === false
                                                ? 'Out of Stock'
                                                : 'Add to Cart'}
                                        </Button>

                                        <Button
                                            as={Link}
                                            to="/products"
                                            variant="outline-secondary"
                                            className="w-100"
                                        >
                                            Continue Shopping
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
