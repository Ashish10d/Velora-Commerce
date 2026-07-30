import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../lib/catalog';

const categories = ['All', 'Footwear', 'Apparel', 'Accessories', 'Tech'];
export default function Shop() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [sort, setSort] = useState('featured');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { setQuery(params.get('search') || ''); setCategory(params.get('category') || 'All'); }, [params]);
  useEffect(() => { let active = true; setLoading(true); const timer = setTimeout(async () => { const results = await fetchProducts({ search: query, category, sort }); if (active) { setProducts(results); setLoading(false); } }, 220); return () => { active = false; clearTimeout(timer); }; }, [query, category, sort]);
  return <main className="shell py-10"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Curated for motion</p><h1 className="mt-2 text-3xl font-black tracking-[-.05em]">{query ? `Results for “${query}”` : 'Find your next essential'}</h1>{query && <p className="mt-2 text-sm text-zinc-500">{loading ? 'Searching…' : `${products.length} similar product${products.length === 1 ? '' : 's'} found`}</p>}</div><div className="flex gap-2"><div className="flex items-center rounded-full border border-zinc-200 bg-white px-3"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products or brands" className="w-36 bg-transparent p-2 text-sm"/></div><select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-full border border-zinc-200 bg-white px-3 text-sm"><option value="featured">Featured</option><option value="low">Price: low</option><option value="rating">Top rated</option></select></div></div><div className="mb-7 flex gap-2 overflow-auto"><SlidersHorizontal size={18} className="mt-2 shrink-0"/>{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-semibold ${item === category ? 'bg-ink text-white' : 'bg-white'}`}>{item}</button>)}</div><div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">{loading ? [...Array(8)].map((_, index) => <div key={index} className="animate-pulse"><div className="aspect-[.86] rounded-2xl bg-zinc-200"/><div className="mt-3 h-4 w-3/4 rounded bg-zinc-200"/></div>) : products.map((product) => <ProductCard product={product} key={product._id}/>)}</div>{!loading && !products.length && <p className="py-16 text-center text-zinc-500">No similar products found. Try a brand, category, or product name.</p>}</main>;
}
