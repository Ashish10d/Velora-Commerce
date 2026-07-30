import { useEffect, useMemo, useState } from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fallbackProducts, } from '../data';
import { money } from '../lib/catalog';
import { useStore } from '../context/StoreContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [product, setProduct] = useState(fallbackProducts.find((item) => item._id === id) || fallbackProducts[0]);
  const [size, setSize] = useState();
  const [color, setColor] = useState();
  useEffect(() => { setProduct(fallbackProducts.find((item) => item._id === id) || fallbackProducts[0]); fetch(`${API}/products/${id}`).then((response) => response.ok ? response.json() : null).then((item) => item && setProduct(item)).catch(() => {}); }, [id]);
  const related = useMemo(() => fallbackProducts.filter((item) => item.category === product.category && item._id !== product._id && item.name !== product.name).slice(0, 4), [product]);
  const saved = isWishlisted(product._id);
  return <main className="shell py-8"><div className="grid gap-10 md:grid-cols-2"><div className="overflow-hidden rounded-3xl bg-zinc-200"><img src={product.image} className="aspect-square w-full object-cover transition duration-700 hover:scale-125"/></div><div className="py-3"><p className="eyebrow">{product.brand} / {product.category}</p><div className="mt-3 flex items-start justify-between gap-4"><h1 className="text-4xl font-black tracking-[-.06em]">{product.name}</h1><button onClick={() => toggleWishlist(product)} className={`rounded-full p-3 ${saved ? 'bg-ink text-white' : 'bg-white shadow-sm'}`} aria-label="Toggle wishlist"><Heart size={20} fill={saved ? 'currentColor' : 'none'}/></button></div><div className="mt-4 flex gap-2 text-sm"><Star size={17} fill="currentColor" className="text-amber-400"/><b>{product.rating}</b><span className="text-zinc-500">{product.numReviews} reviews</span></div><p className="mt-6 text-2xl font-black">{money(product.price)}</p><p className="mt-6 max-w-md leading-7 text-zinc-600">{product.description}</p>{product.colors?.length > 0 && <div className="mt-7"><p className="mb-3 text-sm font-bold">Color</p><div className="flex gap-3">{product.colors.map((item) => <button onClick={() => setColor(item)} key={item} style={{ background: item }} className={`size-7 rounded-full ring-offset-4 ${color === item ? 'ring-2 ring-ink' : ''}`}/>)}</div></div>}{product.sizes?.length > 0 && <div className="mt-7"><p className="mb-3 text-sm font-bold">Size</p><div className="flex gap-2">{product.sizes.map((item) => <button onClick={() => setSize(item)} key={item} className={`size-11 rounded-xl border text-sm font-bold ${size === item ? 'border-ink bg-ink text-white' : 'border-zinc-200'}`}>{item}</button>)}</div></div>}<button onClick={() => addToCart(product, { size, color })} className="btn-dark mt-9 w-full">Add to bag — {money(product.price)} <ShoppingBag size={17}/></button><div className="mt-7 grid grid-cols-3 border-t pt-5 text-center text-xs font-semibold text-zinc-500"><span>Free shipping $150+</span><span>30-day returns</span><span>Secure payment</span></div></div></div>{related.length > 0 && <section className="py-12"><p className="eyebrow">More to explore</p><h2 className="mt-2 text-3xl font-black tracking-[-.05em]">You may also like</h2><p className="mt-2 text-sm text-zinc-500">Similar {product.category.toLowerCase()} pieces selected for you.</p><div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">{related.map((item) => <ProductCard product={item} key={item._id}/>)}</div></section>}</main>;
}
