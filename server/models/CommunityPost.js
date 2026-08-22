import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userAvatar: String,
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

const communityPostSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['trip', 'experience', 'activity', 'destination'],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: String,
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  rating: Number,
  budget: Number,
  duration: Number,
  travelStyle: [String],
  destinationName: String,
  activityDetails: {
    name: String,
    cost: Number,
    duration: String,
    category: String
  },
  tripData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  }
}, { timestamps: true });

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
export default CommunityPost;
