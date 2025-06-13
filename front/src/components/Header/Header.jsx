import React, { useState } from "react";
import { Link } from "react-router-dom";
import imgLogo from "../../assets/images/logo.webp";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="header">
            <img src={imgLogo} alt="Logo" className="logo" />
            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav className={`nav-menu ${isOpen ? "open" : ""}`}>
                <ul>
                    <li><Link to="/products">Productos</Link></li>
                    <li><Link to="/empaques">Empaques</Link></li>
                    <li><Link to="/vendedores">Vendedores</Link></li>
                    <li><Link to="/data">Ventas</Link></li>
                    {/*<li><Link to="/">Cerrar Sesion</Link></li>*/}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
