import react from 'react';
import imgLogo from '../assets/images/logo.webp';

const Header = () => {
  return (
    <header className='Header'>
        <div className='logo-container'>
          <img src={imgLogo} alt="Logo de la Aplicación" className='logo' />
        </div>
        <h1>RuralNet</h1>
    </header>
  );
}

export default Header;
