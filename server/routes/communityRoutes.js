import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import CommunityPost from '../models/CommunityPost.js';
import Trip from '../models/Trip.js';

const router = express.Router();

// Get all community posts with filters, search, and sorting
router.get('/posts', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      travelStyle, 
      budget, 
      duration, 
      rating, 
      sort 
    } = req.query;

    let query = {};

    // 1. Search Query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { destinationName: { $regex: search, $options: 'i' } },
        { authorName: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // 2. Category Filter (mapped from categories navbar)
    if (category && category !== 'All') {
      if (category.toLowerCase() === 'trips') {
        query.type = 'trip';
      } else if (category.toLowerCase() === 'experiences') {
        query.type = 'experience';
      } else if (category.toLowerCase() === 'activities') {
        query.type = 'activity';
      } else if (category.toLowerCase() === 'destinations') {
        query.type = 'destination';
      } else {
        // e.g. Adventure, Food, Culture, Nature, Luxury
        query.tags = { $in: [new RegExp(category, 'i')] };
      }
    }

    // 3. Travel Style Filter
    if (travelStyle) {
      query.travelStyle = { $in: [new RegExp(travelStyle, 'i')] };
    }

    // 4. Budget Filter
    if (budget) {
      if (budget === 'under_10k') {
        query.budget = { $lt: 10000 };
      } else if (budget === '10k_25k') {
        query.budget = { $gte: 10000, $lte: 25000 };
      } else if (budget === '25k_50k') {
        query.budget = { $gte: 25000, $lte: 50000 };
      } else if (budget === '50k_100k') {
        query.budget = { $gte: 50000, $lte: 100000 };
      } else if (budget === 'over_100k') {
        query.budget = { $gt: 100000 };
      }
    }

    // 5. Duration Filter
    if (duration) {
      if (duration === '1_3_days') {
        query.duration = { $gte: 1, $lte: 3 };
      } else if (duration === '4_7_days') {
        query.duration = { $gte: 4, $lte: 7 };
      } else if (duration === '8_14_days') {
        query.duration = { $gte: 8, $lte: 14 };
      } else if (duration === '15_plus_days') {
        query.duration = { $gt: 14 };
      }
    }

    // 6. Rating Filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Build the query execution
    let dbQuery = CommunityPost.find(query).populate('tripData');

    // 7. Sorting
    if (sort) {
      if (sort === 'recent') {
        dbQuery = dbQuery.sort({ createdAt: -1 });
      } else if (sort === 'popular') {
        dbQuery = dbQuery.sort({ 'likes.length': -1, 'saves.length': -1 });
      } else if (sort === 'liked') {
        dbQuery = dbQuery.sort({ 'likes.length': -1 });
      } else if (sort === 'saved') {
        dbQuery = dbQuery.sort({ 'saves.length': -1 });
      } else if (sort === 'rating') {
        dbQuery = dbQuery.sort({ rating: -1 });
      } else if (sort === 'budget_low') {
        dbQuery = dbQuery.sort({ budget: 1 });
      } else if (sort === 'budget_high') {
        dbQuery = dbQuery.sort({ budget: -1 });
      }
    } else {
      // Default: Recommended / Latest
      dbQuery = dbQuery.sort({ createdAt: -1 });
    }

    const posts = await dbQuery.exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new community post
router.post('/posts', protect, async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      coverImage,
      tags,
      rating,
      budget,
      duration,
      travelStyle,
      destinationName,
      activityDetails,
      tripId
    } = req.body;

    const newPost = new CommunityPost({
      type,
      author: req.user._id,
      authorName: req.user.fullName || req.user.name || 'Anonymous',
      title,
      description,
      coverImage,
      tags,
      rating,
      budget,
      duration,
      travelStyle,
      destinationName,
      activityDetails,
      tripData: tripId || null
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/unlike a post
router.post('/posts/:id/like', protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userIndex = post.likes.indexOf(req.user._id);
    if (userIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(userIndex, 1);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save/unsave a post
router.post('/posts/:id/save', protect, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userIndex = post.saves.indexOf(req.user._id);
    if (userIndex === -1) {
      post.saves.push(req.user._id);
    } else {
      post.saves.splice(userIndex, 1);
    }

    await post.save();
    res.json({ saves: post.saves });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment to a post
router.post('/posts/:id/comment', protect, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ message: 'Comment text is required' });

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      user: req.user._id,
      userName: req.user.fullName || req.user.name || 'Anonymous',
      userAvatar: req.user.avatar || '',
      comment
    };

    post.comments.push(newComment);
    await post.save();
    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
