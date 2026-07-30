import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackProducts } from '../data';
import { money } from '../lib/catalog';
import { useStore } from '../context/StoreContext';

export default function Admin() {
  const { user } = useStore(); const [products, setProducts] = useState(fallbackProducts);
  useEffect(() => { fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products?limit=24`).then((response) => response.json()).then((data) => data.products?.length && setProducts(data.products)).catch(() => {}); }, []);
  if (!user?.user?.isAdmin) return <main className="shell py-24 text-center"><h1 className="text-3xl font-black">Admin access required.</h1><Link to="/login" className="btn-dark mt-5">Sign in</Link></main>;
  const alerts = products.filter((product) => product.countInStock < 10).length;
  return <main className="shell py-10"><p className="eyebrow">Operations studio</p><h1 className="mt-2 text-4xl font-black tracking-tight">Commerce at a glance.</h1><div className="mt-8 grid gap-4 md:grid-cols-3">{[['$12,840', 'Revenue', '+18.4% this month'], ['34', 'Orders pending', '7 require attention'], [alerts, 'Inventory alerts', 'Low stock items']].map(([value, label, detail]) => <div className="rounded-2xl bg-white p-6 shadow-sm" key={label}><p className="text-3xl font-black">{value}</p><p className="mt-3 font-bold">{label}</p><p className="mt-1 text-xs text-zinc-500">{detail}</p></div>)}</div><div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm"><div className="flex items-center justify-between p-6"><h2 className="font-black">Inventory</h2><button className="btn-dark px-4 py-2 text-xs">Add product</button></div><table className="w-full text-left text-sm"><thead className="bg-zinc-50 text-xs uppercase text-zinc-500"><tr><th className="p-4">Product</th><th>Category</th><th>Stock</th><th>Price</th></tr></thead><tbody>{products.map((product) => <tr key={product._id} className="border-t border-zinc-100"><td className="p-4 font-bold">{product.name}</td><td>{product.category}</td><td className={product.countInStock < 10 ? 'font-bold text-red-500' : ''}>{product.countInStock}</td><td>{money(product.price)}</td></tr>)}</tbody></table></div></main>;
}
