import React from 'react';
import './Footer.css';

export default function Footer(){
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="contact-info-container">
                    <p className="contact-info">GameCraftHub@mail.ru</p>
                    <p className="contact-info">8-800-555-35-35</p>
                </div>
                <div className="icons">
                    <span className="icon empty-icon"><img src="./Frontend/public/cashe/VK.svg" alt="vk-logo" /></span>
                    <span className="icon empty-icon"><img src="./Frontend/public/cashe/logo-tg.svg" alt="tg-logo" /></span>
                    <span className="icon empty-icon"><img src="./Frontend/public/cashe/github-mark 2.svg" alt="github-logo" /></span>
                </div>
                <p className="rights">ГеймКрафт Хаб © Все права защищены 2025</p>
            </div>
        </footer>
    );
};