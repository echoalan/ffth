import './App.css';
import { Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Empaques from './pages/Empaques';
import Products from './pages/Products';
import Data from './pages/Data';
import Sellers from './pages/Sellers';
import PrivateRoute from './pages/PrivateRoute';  

function App() {
  return (
    <main className='main'>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/products" element={<Products />} />
          <Route path="/empaques" element={<Empaques />} />
          <Route path="/vendedores" element={<Sellers />} />
          <Route path="/data" element={<Data />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
