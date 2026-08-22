import mongoose from 'mongoose';

const routeCacheSchema = new mongoose.Schema({
  originLat: { type: Number, required: true },
  originLng: { type: Number, required: true },
  destLat: { type: Number, required: true },
  destLng: { type: Number, required: true },
  duration: String,
  distance: Number,
  polyline: String,
  createdAt: { type: Date, expires: '30d', default: Date.now }
});

// Compound index for fast lookup of routes
routeCacheSchema.index({ originLat: 1, originLng: 1, destLat: 1, destLng: 1 }, { unique: true });

const RouteCache = mongoose.model('RouteCache', routeCacheSchema);
export default RouteCache;
