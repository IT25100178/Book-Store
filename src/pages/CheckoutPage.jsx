import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/LuxuryTheme.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, tax, delivery, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');

  // DSA Concept: Sorting Summary by Price or Quantity
  const [sortBy, setSortBy] = useState('price');
  
  const sortedItems = useMemo(() => {
    let result = [...cartItems];
    if (sortBy === 'price') {
      result.sort((a, b) => b.price - a.price); // Descending Price
    } else {
      result.sort((a, b) => b.quantity - a.quantity); // Descending Quantity
    }
    return result;
  }, [cartItems, sortBy]);

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // DSA Concept: Queue Simulation
    // Simulating order processing steps
    const processingSteps = ['Validating Address', 'Authorizing Payment', 'Finalizing Order'];
    const queue = [...processingSteps];
    
    const processNext = () => {
      if (queue.length > 0) {
        const currentStep = queue.shift();
        console.log(`Queue processing: ${currentStep}`);
        setTimeout(processNext, 1000);
      } else {
        // Finalize
        const orderData = {
          orderId: 'LB-' + Math.floor(Math.random() * 1000000),
          customer: shippingInfo,
          items: sortedItems,
          total: total.toFixed(2),
          date: new Date().toLocaleDateString()
        };
        
        clearCart();
        navigate('/order-confirmation', { state: { order: orderData } });
      }
    };

    processNext();
  };

  return (
    <div className="luxury-container">
      <h1 className="gradient-text" style={{ textAlign: 'center', marginBottom: '40px' }}>Checkout</h1>

      {/* Step Progress */}
      <div className="step-progress">
        <div className={`step-item ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`step-item ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className={`step-item ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        {/* Main Column */}
        <div className="luxury-card">
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ color: 'var(--luxury-gold)', marginBottom: '20px' }}>Shipping Information</h2>
              <input name="name" className="luxury-input" placeholder="Full Name" onChange={handleInputChange} />
              <input name="email" className="luxury-input" placeholder="Email Address" onChange={handleInputChange} />
              <input name="address" className="luxury-input" placeholder="Street Address" onChange={handleInputChange} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input name="city" className="luxury-input" placeholder="City" onChange={handleInputChange} />
                <input name="zip" className="luxury-input" placeholder="Zip Code" onChange={handleInputChange} />
              </div>
              <button className="btn-luxury" onClick={() => setStep(2)}>Continue to Payment</button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 style={{ color: 'var(--luxury-gold)', marginBottom: '20px' }}>Payment Method</h2>
              <div className="payment-options" style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', padding: '15px', border: '1px solid var(--luxury-gold)', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer' }}>
                  <input type="radio" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span style={{ marginLeft: '10px' }}>Credit / Debit Card (Online Payment)</span>
                </label>
                <label style={{ display: 'block', padding: '15px', border: '1px solid var(--luxury-gold)', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span style={{ marginLeft: '10px' }}>Cash on Delivery</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button className="btn-luxury" style={{ background: 'var(--luxury-gray)', color: 'white' }} onClick={() => setStep(1)}>Back</button>
                <button className="btn-luxury" onClick={() => setStep(3)}>Continue to Summary</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 style={{ color: 'var(--luxury-gold)', marginBottom: '20px' }}>Review Order</h2>
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Shipping to:</strong> {shippingInfo.name}, {shippingInfo.address}</p>
                <p><strong>Payment:</strong> {paymentMethod === 'ONLINE' ? 'Online Transaction' : 'Cash on Delivery'}</p>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button className="btn-luxury" style={{ background: 'var(--luxury-gray)', color: 'white' }} onClick={() => setStep(2)}>Back</button>
                <button className="btn-luxury" onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Place Order Now'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="luxury-card" style={{ height: 'fit-content' }}>
          <h2 style={{ color: 'var(--luxury-gold)', marginBottom: '20px' }}>Order Summary</h2>
          
          <div style={{ marginBottom: '15px', fontSize: '0.8rem', color: '#888' }}>
            Sort items by: 
            <select style={{ background: 'none', color: 'var(--luxury-gold)', border: 'none', marginLeft: '5px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price">Price</option>
              <option value="quantity">Quantity</option>
            </select>
          </div>

          <div className="cart-items-summary" style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
            {sortedItems.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                  <div style={{ fontSize: '0.9rem', color: '#888' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ color: 'var(--luxury-gold)' }}>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px solid var(--luxury-gold)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span>Delivery</span>
              <span>{delivery === 0 ? 'FREE' : `$${delivery.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--luxury-gold)' }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
