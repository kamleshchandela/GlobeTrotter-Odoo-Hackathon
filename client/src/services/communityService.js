import { apiClient } from '../api/axios';

// Mock data fallback in case the backend server is unreachable
const MOCK_POSTS = [
  {
    id: "mock-1",
    type: "trip",
    authorName: "Ananya Mehta",
    title: "Japan in 10 Days 🇯🇵",
    description: "A perfect mix of food, culture, and adventure. Visited Tokyo, Kyoto, and Osaka. Highlights include sushi tasting in Tsukiji, bamboo forest in Arashiyama, and street food in Dotonbori.",
    coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80",
    tags: ["Japan", "BudgetTravel", "Food", "Culture", "Trips"],
    likes: [],
    saves: [],
    comments: [
      {
        id: "c1",
        userName: "Arjun Verma",
        comment: "This place looks amazing! Did you need a visa beforehand?",
        createdAt: new Date().toISOString()
      }
    ],
    rating: 4.9,
    budget: 94500,
    duration: 10,
    travelStyle: ["Culture", "Food", "Budget"],
    destinationName: "Japan",
    tripData: {
      location: "Japan",
      tripTitle: "Japan in 10 Days",
      overview: "Experience the vibrant cities and scenic spots of Japan.",
      duration: 10,
      budget: "₹94,500",
      dailyItinerary: [
        {
          day: 1,
          theme: "Tokyo Arrival",
          activities: [
            { time: "10:00 AM", activity: "Check-in at Hotel Gracery Shinjuku", description: "Stay in the heart of Tokyo.", location: "Shinjuku, Tokyo" },
            { time: "2:00 PM", activity: "Explore Shinjuku Gyoen National Garden", description: "Beautiful traditional Japanese garden.", location: "Shinjuku, Tokyo" }
          ],
          foodSuggestions: ["Ramen in Shinjuku"],
          safetyNotes: "Keep your Pasmo card topped up."
        }
      ],
      estimatedCosts: { total: "₹94,500", breakdown: { accommodation: "₹45,000", food: "₹25,000", transport: "₹15,000", activities: "₹9,500" } },
      essentialPacking: ["Universal Adapter", "Pocket Wi-Fi"]
    }
  },
  {
    id: "mock-2",
    type: "experience",
    authorName: "Priya Sharma",
    title: "The perfect evening in Kyoto 🇯🇵",
    description: "If you're visiting Kyoto, don't miss the sunset near Yasaka Pagoda in Gion. Walk through the traditional wooden streets and keep an eye out for Geishas heading to dinners. The lighting is magical around 6 PM.",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    tags: ["Kyoto", "Japan", "Photography", "Experiences"],
    likes: [],
    saves: [],
    comments: [],
    rating: 4.8,
    destinationName: "Kyoto, Japan",
    travelStyle: ["Culture", "Photography"]
  },
  {
    id: "mock-3",
    type: "activity",
    authorName: "Karan Malhotra",
    title: "Paragliding in Manali 🪂",
    description: "Soaring above the Solang Valley was the highlight of my Himachal trip. The view of the snow-capped Himalayan peaks is absolutely breathtaking. Book through verified operators only!",
    coverImage: "https://images.unsplash.com/photo-1626621331169-5f34be280ed9?auto=format&fit=crop&w=800&q=80",
    tags: ["Adventure", "Manali", "Himachal", "Activities"],
    likes: [],
    saves: [],
    comments: [],
    rating: 4.7,
    budget: 2500,
    duration: 1,
    travelStyle: ["Adventure"],
    destinationName: "Manali, India",
    activityDetails: {
      name: "Solang Valley Paragliding",
      cost: 2500,
      duration: "2-3 hours",
      category: "Adventure"
    }
  },
  {
    id: "mock-4",
    type: "destination",
    authorName: "Aisha Rao",
    title: "Goa: Beyond the Beaches 🌴",
    description: "Goa is famous for its beaches, but the real gems are the old Portuguese quarters in Fontainhas, the spice plantations in Ponda, and the local Goan fish curry at small beach shacks.",
    coverImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    tags: ["Goa", "India", "Beach", "Destinations"],
    likes: [],
    saves: [],
    comments: [],
    rating: 4.6,
    budget: 18000,
    duration: 5,
    travelStyle: ["Relaxing", "Food"],
    destinationName: "Goa, India"
  }
];

export const communityService = {
  async getPosts(params = {}) {
    try {
      const response = await apiClient.get('/community/posts', { params });
      return response.data;
    } catch (error) {
      console.warn("API error, falling back to mock data:", error);
      
      // Perform mock client-side search/filtering
      let filtered = [...MOCK_POSTS];
      
      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.destinationName.toLowerCase().includes(query) ||
          p.tags.some(t => t.toLowerCase().includes(query))
        );
      }

      if (params.category && params.category !== 'All') {
        const cat = params.category.toLowerCase();
        if (['trips', 'experiences', 'activities', 'destinations'].includes(cat)) {
          const typeMap = { trips: 'trip', experiences: 'experience', activities: 'activity', destinations: 'destination' };
          filtered = filtered.filter(p => p.type === typeMap[cat]);
        } else {
          filtered = filtered.filter(p => p.tags.some(t => t.toLowerCase() === cat));
        }
      }

      if (params.travelStyle) {
        filtered = filtered.filter(p => p.travelStyle?.some(s => s.toLowerCase() === params.travelStyle.toLowerCase()));
      }

      if (params.budget) {
        if (params.budget === 'under_10k') filtered = filtered.filter(p => (p.budget || 0) < 10000);
        else if (params.budget === '10k_25k') filtered = filtered.filter(p => (p.budget || 0) >= 10000 && (p.budget || 0) <= 25000);
        else if (params.budget === '25k_50k') filtered = filtered.filter(p => (p.budget || 0) >= 25000 && (p.budget || 0) <= 50000);
        else if (params.budget === '50k_100k') filtered = filtered.filter(p => (p.budget || 0) >= 50000 && (p.budget || 0) <= 100000);
        else if (params.budget === 'over_100k') filtered = filtered.filter(p => (p.budget || 0) > 100000);
      }

      if (params.duration) {
        if (params.duration === '1_3_days') filtered = filtered.filter(p => (p.duration || 0) >= 1 && (p.duration || 0) <= 3);
        else if (params.duration === '4_7_days') filtered = filtered.filter(p => (p.duration || 0) >= 4 && (p.duration || 0) <= 7);
        else if (params.duration === '8_14_days') filtered = filtered.filter(p => (p.duration || 0) >= 8 && (p.duration || 0) <= 14);
        else if (params.duration === '15_plus_days') filtered = filtered.filter(p => (p.duration || 0) > 14);
      }

      // Sort fallback
      if (params.sort === 'recent') {
        // mock sort
      } else if (params.sort === 'budget_low') {
        filtered.sort((a, b) => (a.budget || 0) - (b.budget || 0));
      } else if (params.sort === 'budget_high') {
        filtered.sort((a, b) => (b.budget || 0) - (a.budget || 0));
      } else if (params.sort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      return filtered;
    }
  },

  async createPost(postData) {
    try {
      const response = await apiClient.post('/community/posts', postData);
      return response.data;
    } catch (error) {
      console.warn("API error creating post, fallback simulated:", error);
      const newMockPost = {
        id: `mock-${Date.now()}`,
        ...postData,
        authorName: "You",
        likes: [],
        saves: [],
        comments: [],
        createdAt: new Date().toISOString()
      };
      MOCK_POSTS.unshift(newMockPost);
      return newMockPost;
    }
  },

  async likePost(id) {
    try {
      const response = await apiClient.post(`/community/posts/${id}/like`);
      return response.data;
    } catch (error) {
      console.warn("API error liking post, fallback simulated:", error);
      const post = MOCK_POSTS.find(p => p.id === id);
      if (post) {
        const idx = post.likes.indexOf("current-user");
        if (idx === -1) post.likes.push("current-user");
        else post.likes.splice(idx, 1);
        return { likes: post.likes };
      }
      return { likes: [] };
    }
  },

  async savePost(id) {
    try {
      const response = await apiClient.post(`/community/posts/${id}/save`);
      return response.data;
    } catch (error) {
      console.warn("API error saving post, fallback simulated:", error);
      const post = MOCK_POSTS.find(p => p.id === id);
      if (post) {
        const idx = post.saves.indexOf("current-user");
        if (idx === -1) post.saves.push("current-user");
        else post.saves.splice(idx, 1);
        return { saves: post.saves };
      }
      return { saves: [] };
    }
  },

  async commentPost(id, comment) {
    try {
      const response = await apiClient.post(`/community/posts/${id}/comment`, { comment });
      return response.data;
    } catch (error) {
      console.warn("API error adding comment, fallback simulated:", error);
      const post = MOCK_POSTS.find(p => p.id === id);
      if (post) {
        const newComment = {
          id: `c-${Date.now()}`,
          userName: "You",
          comment,
          createdAt: new Date().toISOString()
        };
        post.comments.push(newComment);
        return post.comments;
      }
      return [];
    }
  },

  async updateTrip(id, tripData) {
    try {
      const response = await apiClient.put(`/trips/${id}`, tripData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
