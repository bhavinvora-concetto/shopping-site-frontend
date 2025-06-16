import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="ecom-footer text-white pt-5 pb-3">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5 className="footer-brand">ShopEasy</h5>
            <p>
              Your one-stop destination for quality products at the best prices.
            </p>
          </div>

          <div className="col-md-2">
            <h6 className="footer-heading">Shop</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/products" className="footer-link">
                  All Products
                </a>
              </li>
              <li>
                <a href="/categories" className="footer-link">
                  Categories
                </a>
              </li>
              <li>
                <a href="/offers" className="footer-link">
                  Offers
                </a>
              </li>
              <li>
                <a href="/cart" className="footer-link">
                  Cart
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="footer-heading">Company</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="footer-link">
                  Contact
                </a>
              </li>
              <li>
                <a href="/careers" className="footer-link">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="footer-heading">Help</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/faq" className="footer-link">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/returns" className="footer-link">
                  Returns
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="footer-link">
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="footer-heading">Follow Us</h6>
            <div className="footer-social d-flex gap-3">
              <a href="#" className="footer-icon">
                <FaFacebookF />
              </a>
              <a href="#" className="footer-icon">
                <FaInstagram />
              </a>
              <a href="#" className="footer-icon">
                <FaTwitter />
              </a>
              <a href="#" className="footer-icon">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <hr className="bg-light" />
        <p className="text-center mb-0">
          &copy; {new Date().getFullYear()} ShopEasy. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
