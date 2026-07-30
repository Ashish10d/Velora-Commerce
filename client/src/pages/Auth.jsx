import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export function Login() { return <AuthForm mode="login"/>; }
export function Register() { return <AuthForm mode="register"/>; }

function AuthForm({ mode }) {
  const { setUser } = useStore(); const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' }); const [error, setError] = useState('');
  const register = mode === 'register';
  const submit = async (event) => { event.preventDefault(); setError(''); try { const response = await fetch(`${API}/auth/${register ? 'register' : 'login'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(register ? form : { email: form.email, password: form.password }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); localStorage.setItem('velora-user', JSON.stringify(data)); setUser(data); navigate('/'); } catch (requestError) { setError(requestError.message || 'Unable to continue.'); } };
  return <main className="shell grid min-h-[65vh] place-items-center"><form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm"><p className="eyebrow">{register ? 'Join the community' : 'Welcome back'}</p><h1 className="mt-2 text-4xl font-black tracking-tight">{register ? 'Create your account.' : 'Sign in to Velora.'}</h1>{register && <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required placeholder="Full name" className="mt-8 w-full border-b py-3"/>}<input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required type="email" placeholder="Email" className={`${register ? 'mt-4' : 'mt-8'} w-full border-b py-3`}/><input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={6} type="password" placeholder="Password (6+ characters)" className="mt-4 w-full border-b py-3"/>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<button className="btn-dark mt-7 w-full">{register ? 'Create account' : 'Sign in'} <ArrowRight size={17}/></button><p className="mt-5 text-center text-sm text-zinc-500">{register ? 'Already have an account?' : 'New to Velora?'} <Link className="font-bold text-ink underline" to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></p></form></main>;
}
