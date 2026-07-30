import { fallbackProducts } from '../data';

export const money = (value) => `$${Number(value).toFixed(2)}`;

const aliases = {
  shoe: ['shoe', 'sneaker', 'runner', 'footwear'],
  shoes: ['shoe', 'sneaker', 'runner', 'footwear'],
  sneaker: ['shoe', 'sneaker', 'runner', 'footwear'],
  sneakers: ['shoe', 'sneaker', 'runner', 'footwear'],
  headphone: ['headphone', 'earphone', 'audio', 'sound'],
  headphones: ['headphone', 'earphone', 'audio', 'sound'],
  earphone: ['headphone', 'earphone', 'audio', 'sound'],
  earphones: ['headphone', 'earphone', 'audio', 'sound']
};

export const getFallbackProducts = (search = '', category = 'All', sort = 'featured', limit) => {
  const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const terms = [...new Set(words.flatMap((word) => aliases[word] || [word]))];
  const products = fallbackProducts.filter((product) => {
    const content = [product.name, product.brand, product.category, product.description].filter(Boolean).join(' ').toLowerCase();
    return (category === 'All' || product.category === category) && (!terms.length || terms.some((term) => content.includes(term)));
  });
  if (sort === 'low') products.sort((a, b) => a.price - b.price);
  if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
  return limit ? products.slice(0, limit) : products;
};

export const fetchProducts = async ({ search = '', category = 'All', sort = 'featured', limit = 24 }) => {
  try {
    const params = new URLSearchParams({ search, category, sort, limit: String(limit) });
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products?${params}`);
    if (!response.ok) throw new Error('Product request failed');
    const data = await response.json();
    return data.products?.length ? data.products : getFallbackProducts(search, category, sort, limit);
  } catch {
    return getFallbackProducts(search, category, sort, limit);
  }
};
