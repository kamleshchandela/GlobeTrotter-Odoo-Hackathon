import mongoose from 'mongoose';

const placeCacheSchema = new mongoose.Schema({
  query: { type: String, required: true, unique: true },
  placeId: String,
  lat: Number,
  lng: Number,
  photoUrl: String,
  createdAt: { type: Date, expires: '30d', default: Date.now }
});

const PlaceCache = mongoose.model('PlaceCache', placeCacheSchema);
export default PlaceCache;
