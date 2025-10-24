import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="contact-info-container">
                    <p className="contact-info">GameCraftHub@mail.ru</p>
                    <p className="contact-info">8-800-555-35-35</p>
                </div>
                <div className="icons">
                    <span className="icon empty-icon"><img src="/cashe/VK.png" alt="vk" /></span>
                    <span className="icon empty-icon"><img src="/cashe/logo-tg.png" alt="tg" /></span>
                    <span className="icon empty-icon"><img src="/cashe/github-mark 2.png" alt="github" /></span>
                </div>
                <p className="rights">ГеймКрафт Хаб © Все права защищены 2025</p>
            </div>
        </footer>
    );
};

export default Footer;