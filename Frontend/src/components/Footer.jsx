import React from 'react';
import './Footer.css'; // Импортируйте CSS файл для стилей

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="contact-info">GameCraftHub@mail.ru</p>
                <p className="contact-info">8-800-555-35-35</p>
                <div className="icons">
                    <span className="icon empty-icon"></span>
                    <span className="icon empty-icon"></span>
                    <span className="icon empty-icon"></span>
                </div>
                <p className="rights">ГеймКрафт Хаб © Все права защищены 2025</p>
            </div>
        </footer>
    );
};

export default Footer;
