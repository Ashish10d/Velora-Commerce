import { useState } from 'react';
import { Heart, Search, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export default function Navbar() {
  const { cart, wishlist, setCartOpen, user } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const submit = (event) => { event.preventDefault(); navigate(`/shop?search=${encodeURIComponent(search.trim())}`); };
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  return <>
    <div className="bg-ink py-2 text-center font-mono text-[10px] font-bold tracking-[.15em] text-white">COMPLIMENTARY SHIPPING ON ORDERS $150+</div>
    <header className="shell flex h-20 items-center justify-between gap-4">
      <Link to="/" className="text-xl font-black tracking-[-.1em]">VELORA<span className="text-zinc-400">®</span></Link>
      <nav className="hidden gap-7 text-sm font-semibold lg:flex"><Link to="/shop">Shop</Link><Link to="/shop?category=Apparel">Apparel</Link><Link to="/shop?category=Tech">Objects</Link>{user?.user?.isAdmin && <Link to="/admin">Studio</Link>}</nav>
      <form onSubmit={submit} className="hidden max-w-xs flex-1 items-center rounded-full bg-white px-3 shadow-sm md:flex"><Search size={16} className="text-zinc-400"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="w-full bg-transparent px-2 py-2.5 text-sm"/><button aria-label="Search"><ArrowRight size={16}/></button></form>
      <div className="flex items-center gap-3"><Link className="relative grid size-10 place-items-center rounded-full bg-white shadow-sm" to="/wishlist" aria-label="Wishlist"><Heart size={18}/>{wishlist.length > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-lime text-[10px] font-black">{wishlist.length}</span>}</Link><Link className="hidden text-sm font-semibold xl:block" to="/login">{user?.user?.name || 'Account'}</Link><button onClick={() => setCartOpen(true)} className="relative grid size-10 place-items-center rounded-full bg-white shadow-sm"><ShoppingBag size={19}/>{cartCount > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-lime text-[10px] font-black">{cartCount}</span>}</button></div>
    </header>
  </>;
}
