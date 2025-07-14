import './App.css';
import { Route, Routes } from "react-router-dom";
import PrivateRoute from './pages/PrivateRoute';
import Login from './pages/Login';
import Mapa from './pages/Mapa';

function App() {
  return (
    <main className='main'>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/Mapa" element={<Mapa />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
