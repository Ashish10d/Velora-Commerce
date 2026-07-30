import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, image: { type: String, required: true },
  brand: String, category: { type: String, required: true }, description: String,
  price: { type: Number, required: true, min: 0 }, countInStock: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 0 }, numReviews: { type: Number, default: 0 },
  colors: [String], sizes: [String], featured: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Product', productSchema);
