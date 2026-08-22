import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const NewTripStep1 = lazy(() => import("../pages/trips/NewTripStep1"));
const TripItinerary = lazy(() => import("../pages/trips/TripItinerary"));
const TripMapView = lazy(() => import("../pages/trips/TripMapView"));

const TripRoutes = () => (
  <>
    <Route path="/trips/new" element={<NewTripStep1 />} />
    <Route path="/trips/:id/itinerary" element={<TripItinerary />} />
    <Route path="/trips/:id/map" element={<TripMapView />} />
    <Route path="/trips/:id" element={<TripItinerary />} />
  </>
);



export default TripRoutes;
