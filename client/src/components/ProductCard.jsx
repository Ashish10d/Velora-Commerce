import { Heart, Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { money } from '../lib/catalog';
import { useStore } from '../context/StoreContext';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const saved = isWishlisted(product._id);
  return <motion.article layout whileHover={{ y: -5 }} className="group relative"><Link to={`/product/${product._id}`} className="block"><div className="relative overflow-hidden rounded-2xl bg-zinc-200"><img src={product.image} className="aspect-[.86] w-full object-cover transition duration-500 group-hover:scale-105"/><div className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider backdrop-blur">{product.countInStock < 10 ? 'Low stock' : product.category}</div></div><div className="flex items-start justify-between pt-3"><div><p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{product.brand}</p><h3 className="mt-1 font-bold">{product.name}</h3><div className="mt-1 flex items-center gap-1 text-xs"><Star size={13} fill="currentColor" className="text-amber-400"/><span className="font-semibold">{product.rating}</span><span className="text-zinc-400">({product.numReviews})</span></div></div><b>{money(product.price)}</b></div></Link><button onClick={() => toggleWishlist(product)} aria-label={`Save ${product.name}`} className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur ${saved ? 'bg-ink text-white' : 'bg-white/80'}`}><Heart size={16} fill={saved ? 'currentColor' : 'none'}/></button><button onClick={() => addToCart(product)} className="btn-dark absolute bottom-20 right-3 translate-y-3 px-3 py-2 opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">Quick add <Plus size={15}/></button></motion.article>;
}
