import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { StoreProvider } from './context/StoreContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import { Login, Register } from './pages/Auth';
import Admin from './pages/Admin';

function App() {
  return <StoreProvider><Navbar/><CartDrawer/><Routes><Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/><Route path="/product/:id" element={<ProductDetails/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/admin" element={<Admin/>}/></Routes><Footer/></StoreProvider>;
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
