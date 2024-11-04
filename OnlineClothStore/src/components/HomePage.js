// src/components/HomePage.js
import React from 'react';
import './HomePage.css'; // Optional: if you want to style your home page


export default function HomePage() {
  return (
    <div>
      <section id="hero">
      <h4 className="text-yellow-600">Trade-in-offer</h4>
<h2 className="text-yellow-600">Super value deals</h2>  
<h1 className="text-yellow-300">On all products</h1>
<p className="text-black">Save more with coupons & up to 70% off!</p>
<button className="text-yellow-300">Shop Now</button>
        </section>
        
       
    
        {/* <section id="banner" className="section-m1">
            <h4>Repair Services</h4>
            <h2>Up to <span>70% Off</span> - All t-Shirts & Accessories</h2>
            <button className="normal">Explore More</button>
        </section>
     */}
    
    
        <section id="newsletter" className="section-p1 section-m1">
            <div className="newstext">
                <h4>Sign Up For Newsletter</h4>
                <p>Get E-mail updates about our latest shop and <span>special offers.</span></p>
            </div>
            <div className="form">
                <input type="text" placeholder="Your email address"/>
                <button className="normal">Sign Up</button>
            </div>
        </section>
    
        <footer className="section-p1">
            <div className="col">
                <img className="logo" src="images/logo.png" alt=""/>
                <h4>Contact</h4>
                <p><strong>Address:</strong> 22 Around Downtown Bedria City Mall</p>
                <p><strong>Phone:</strong> +251-4655990</p>
                <p><strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p>
                <div className="follow">
                    <h4>Follow us</h4>
                    <div className="icon">
                        <i className="fab fa-facebook-f"></i>
                        <i className="fab fa-twitter"></i>
                        <i className="fab fa-instagram"></i>
                        <i className="fab fa-pinterest-p"></i>
                        <i className="fab fa-youtube"></i>
                    </div>
                </div>
            </div>
            <div className="col">
                <h4>About</h4>
                <a href="#">About us</a>
                <a href="#">Delivery Information</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms & Conditions</a>
                <a href="#">Contact Us</a>
            </div>
            <div className="col">
                <h4>My Account</h4>
                <a href="#">Sign In</a>
                <a href="#">View Cart</a>
                <a href="#">My Wishlist</a>
                <a href="#">Track My Order</a>
                <a href="#">Help</a>
            </div>
            <div className="col install"/>
                <h4>Install App</h4>
                <p>From App Store or Google Play</p>
                <div className="row">
                    <img src="images/pay/app.jpg" alt=""/>
                    <img src="images/pay/play.jpg" alt=""/>
                </div>
                <p>Secured Payment Gateway</p>
                <img src="images/pay/pay.png" alt=""/>
        
  </footer>
        </div>
    
    
  )
}
