import { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

export default function ProductCatalog() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`);

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                notyf.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Format price as Philippine Peso
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
                <p>Loading products...</p>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h1 className="mb-4 text-center">Our Products</h1>

            <Row xs={1} md={2} lg={3} className="g-4">
                {products.map((product) => (
                    <Col key={product._id}>
                        <Card className="h-100 shadow-sm product-card">
                            <Link
                                to={`/products/${product._id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="image-container" style={{ height: '200px', overflow: 'hidden' }}>
                                    <Card.Img
                                        variant="top"
                                        src={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain',
                                            objectPosition: 'center',
                                            cursor: 'pointer',
                                        }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                                        }}
                                    />
                                </div>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="mb-2">{product.name}</Card.Title>
                                    <Card.Text className="text-muted mb-3 flex-grow-1">
                                        {product.description.length > 100
                                            ? `${product.description.substring(0, 100)}...`
                                            : product.description}
                                    </Card.Text>
                                    <h5 className="text-primary mb-3">{formatPrice(product.price)}</h5>
                                </Card.Body>
                            </Link>
                            <Card.Body className="pt-0">
                                <Button
                                    as={Link}
                                    to={`/products/${product._id}`}
                                    variant="primary"
                                    className="mt-auto w-100"
                                >
                                    View Details
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>


        </Container>
    );
}