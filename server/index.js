import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import googleRoutes from './routes/googleRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import healthcareRoutes from './routes/healthcareRoutes.js';
import sosRoutes from './routes/sosRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import CommunityPost from './models/CommunityPost.js';
import User from './models/User.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1);



// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) || "*",
  credentials: true,
}));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, service: "my-itinerary-api" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

async function seedCommunityPosts() {
  try {
    const postCount = await CommunityPost.countDocuments();
    if (postCount > 0) {
      console.log('Community posts already exist, skipping seeding.');
      return;
    }

    console.log('Seeding initial community posts...');

    // Find or create a mock author
    let authorUser = await User.findOne();
    if (!authorUser) {
      authorUser = await User.create({
        fullName: 'Ananya Mehta',
        email: 'ananya@globetrotter.com',
        password: 'defaultpassword123',
        avatar: 'A'
      });
    }

    const posts = [
      {
        type: 'trip',
        author: authorUser._id,
        authorName: authorUser.fullName,
        title: 'Japan in 10 Days 🇯🇵',
        description: 'A perfect mix of food, culture, and adventure. Visited Tokyo, Kyoto, and Osaka. Highlights include sushi tasting in Tsukiji, bamboo forest in Arashiyama, and street food in Dotonbori.',
        coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        tags: ['Japan', 'BudgetTravel', 'Food', 'Culture', 'Trips'],
        likes: [authorUser._id],
        saves: [authorUser._id],
        rating: 4.9,
        budget: 94500,
        duration: 10,
        travelStyle: ['Culture', 'Food', 'Budget'],
        destinationName: 'Japan',
        comments: [
          {
            user: authorUser._id,
            userName: 'Arjun Verma',
            comment: 'This place looks amazing! Did you need a visa beforehand?'
          }
        ]
      },
      {
        type: 'experience',
        author: authorUser._id,
        authorName: 'Priya Sharma',
        title: 'The perfect evening in Kyoto 🇯🇵',
        description: 'If you are visiting Kyoto, don\'t miss the sunset near Yasaka Pagoda in Gion. Walk through the traditional wooden streets and keep an eye out for Geishas heading to dinners. The lighting is magical around 6 PM.',
        coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        tags: ['Kyoto', 'Japan', 'Photography', 'Experiences'],
        likes: [],
        saves: [],
        rating: 4.8,
        destinationName: 'Kyoto, Japan',
        comments: []
      },
      {
        type: 'activity',
        author: authorUser._id,
        authorName: 'Karan Malhotra',
        title: 'Paragliding in Manali 🪂',
        description: 'Soaring above the Solang Valley was the highlight of my Himachal trip. The view of the snow-capped Himalayan peaks is absolutely breathtaking. Book through verified operators only!',
        coverImage: 'https://images.unsplash.com/photo-1626621331169-5f34be280ed9?auto=format&fit=crop&w=800&q=80',
        tags: ['Adventure', 'Manali', 'Himachal', 'Activities'],
        likes: [],
        saves: [],
        rating: 4.7,
        budget: 2500,
        duration: 1,
        travelStyle: ['Adventure'],
        destinationName: 'Manali, India',
        activityDetails: {
          name: 'Solang Valley Paragliding',
          cost: 2500,
          duration: '2-3 hours',
          category: 'Adventure'
        },
        comments: []
      },
      {
        type: 'destination',
        author: authorUser._id,
        authorName: 'Aisha Rao',
        title: 'Goa: Beyond the Beaches 🌴',
        description: 'Goa is famous for its beaches, but the real gems are the old Portuguese quarters in Fontainhas, the spice plantations in Ponda, and the local Goan fish curry at small beach shacks.',
        coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
        tags: ['Goa', 'India', 'Beach', 'Destinations'],
        likes: [],
        saves: [],
        rating: 4.6,
        budget: 18000,
        duration: 5,
        travelStyle: ['Relaxing', 'Food'],
        destinationName: 'Goa, India',
        comments: []
      }
    ];

    await CommunityPost.insertMany(posts);
    console.log('Seeded 4 initial community posts successfully.');
  } catch (err) {
    console.error('Failed to seed community posts:', err.message);
  }
}

// Connect Database and Start Server
connectDB().then(async () => {
  await seedCommunityPosts();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error("Critical: Database connection failed. Server not started.", err.message);
  process.exit(1);
});

