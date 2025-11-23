import react, { useState } from 'react';
import imgLogo from '../assets/images/logo.webp';

const Header = ({
  toggleVerClientes,
  toggleClientesAltos
}) => {

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className='Header'>
      <div className='containerLogoTititle'>
        <div className='logo-container'>
          <img src={imgLogo} alt="Logo de la Aplicación" className='logo' />
        </div>
        <h1>RuralNet</h1>
      </div>

      {/* BOTÓN HAMBURGUESA */}
      <button 
        className="hamburger"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <span></span><span></span><span></span>
      </button>

      {/* MENÚ (MOBILE Y DESKTOP) */}
      <div className={`containerBtnVer ${openMenu ? "open" : ""}`}>
        <button onClick={toggleVerClientes}>          
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM6 11c1.66 0 3-1.34 3-3S7.66 5 6 5 3 6.34 3 8s1.34 3 3 3zm10 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5c0-2.33-4.67-3.5-7-3.5zM6 13c-2.33 0-7 1.17-7 3.5V20h7v-3.5C6 14.17 8.33 13 6 13z" fill="currentColor" />
          </svg>
          Ver Clientes
        </button>

        <button onClick={toggleClientesAltos}>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path d="M1 21h22L12 2 1 21zM12 16h-1v-4h2v4h-1zm0 4h-1v-2h2v2h-1z" fill="currentColor" />
          </svg>
          Clientes Altos
        </button>
      </div>
    </header>
  );
}

export default Header;
