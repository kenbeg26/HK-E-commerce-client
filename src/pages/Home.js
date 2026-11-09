import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <Container className="py-3 py-md-5">
            {/* Hero Section */}
            <Row className="align-items-center mb-4 mb-md-5">
                <Col xs={12} md={6} className="order-md-1 order-2 mt-4 mt-md-0">
                    <h1 className="display-5 display-md-4 mb-3">Premium Smartphones</h1>
                    <p className="lead mb-4">
                        Discover the latest flagship phones with cutting-edge technology at unbeatable prices.
                    </p>
                    <Button 
                        as={Link} 
                        to="/products" 
                        size="lg"
                        className="me-2 px-4 py-2 fw-bold"
                        style={{
                            background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
                        }}
                    >
                        Shop Now
                    </Button>
                </Col>
                <Col xs={12} md={6} className="order-md-2 order-1">
                    <div className="ratio ratio-16x9 bg-light rounded-3 overflow-hidden">
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <img 
                                src="hero-smartphone.gif" 
                                alt="Premium Smartphone" 
                                className="img-fluid h-100 object-fit-cover"
                            />
                        </div>
                    </div>
                </Col>
            </Row>
    
            {/* Features Section */}
            <Row className="py-4 py-md-5 bg-light rounded-3 mb-4 mb-md-5 g-3" style={{
                            background: 'linear-gradient(45deg,rgb(230, 108, 108),rgb(245, 167, 125))',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
                        }}>
                <Col xs={12} md={4} className="text-center p-3 p-md-4">
                    <div className="mb-3">
                        <i className="bi bi-lightning-charge fs-1" style={{ color: '#FF6B6B' }}></i>
                    </div>
                    <h4>Latest Technology</h4>
                    <p className="text-muted">
                        Stay ahead with the most advanced smartphone features and innovations.
                    </p>
                </Col>
                <Col xs={12} md={4} className="text-center p-3 p-md-4">
                    <div className="mb-3">
                        <i className="bi bi-shield-check fs-1" style={{ color: '#FF6B6B' }}></i>
                    </div>
                    <h4>Verified Quality</h4>
                    <p className="text-muted">
                        All our phones undergo rigorous quality checks before delivery.
                    </p>
                </Col>
                <Col xs={12} md={4} className="text-center p-3 p-md-4">
                    <div className="mb-3">
                        <i className="bi bi-headset fs-1" style={{ color: '#FF6B6B' }}></i>
                    </div>
                    <h4>24/7 Support</h4>
                    <p className="text-muted">
                        Our customer service team is always ready to assist you.
                    </p>
                </Col>
            </Row>
    
            {/* Call to Action */}
            <Row className="text-center py-4 py-md-5 mb-3 mb-md-4">
                <Col>
                    <h2 className="mb-3 mb-md-4">Ready to Upgrade Your Device?</h2>
                    <Button 
                        as={Link} 
                        to="/products" 
                        size="lg"
                        className="px-3 py-2 fw-bold"
                        style={{
                            background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
                        }}
                    >
                        Browse Our Collection
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}