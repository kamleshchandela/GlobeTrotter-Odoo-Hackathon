import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../config/env';

export const fetchTrips = createAsyncThunk('trip/fetchTrips', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/trips`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch trips');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchTripById = createAsyncThunk('trip/fetchTripById', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch trip');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const saveTrip = createAsyncThunk('trip/saveTrip', async (tripData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/trips/save`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(tripData)
    });
    if (!response.ok) throw new Error('Failed to save trip');
    return await response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    trips: [],
    currentTrip: null,
    loading: false,
    error: null,
  },
  reducers: {
    setTripStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setTripSuccess: (state, action) => {
      state.loading = false;
      state.currentTrip = action.payload;
    },
    setTripsSuccess: (state, action) => {
      state.loading = false;
      state.trips = action.payload;
    },
    setTripFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearTrip: (state) => {
      state.currentTrip = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTripById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveTrip.fulfilled, (state, action) => {
        state.trips.unshift(action.payload);
        state.currentTrip = action.payload;
      });
  }
});

export const { setTripStart, setTripSuccess, setTripsSuccess, setTripFailure, clearTrip } = tripSlice.actions;
export default tripSlice.reducer;
