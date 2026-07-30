import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

export default function Wishlist() {
  const { wishlist } = useStore();
  return <main className="shell py-10"><p className="eyebrow">Saved for later</p><h1 className="mt-2 text-4xl font-black tracking-[-.06em]">Your wishlist</h1>{wishlist.length ? <><p className="mt-3 text-sm text-zinc-500">{wishlist.length} piece{wishlist.length === 1 ? '' : 's'} waiting for you.</p><div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">{wishlist.map((product) => <ProductCard product={product} key={product._id}/>)}</div></> : <div className="mt-10 grid min-h-72 place-items-center rounded-3xl bg-white text-center"><div><div className="mx-auto grid size-14 place-items-center rounded-full bg-lime"><Heart size={22}/></div><h2 className="mt-4 text-2xl font-black">Your wishlist is empty.</h2><p className="mt-2 text-sm text-zinc-500">Save the pieces you want to revisit.</p><Link to="/shop" className="btn-dark mt-6">Explore products</Link></div></div>}</main>;
}
