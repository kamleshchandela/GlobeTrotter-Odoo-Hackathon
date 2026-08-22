import { lazy } from "react";
import { Route } from "react-router-dom";

const TripDashboard = lazy(() => import("../pages/trips/TripDashboard"));
const GemDetail = lazy(() => import("../pages/discover/GemDetail"));
const CommunitySpots = lazy(() => import("../pages/discover/CommunitySpots"));
const LocalExperiences = lazy(() => import("../pages/discover/LocalExperiences"));

const DiscoverRoutes = () => (
  <>
    <Route path="/explore" element={<TripDashboard />} />
    <Route path="/explore/:id" element={<GemDetail />} />
    <Route path="/community" element={<CommunitySpots />} />
    <Route path="/experiences" element={<LocalExperiences />} />
    <Route path="/trips" element={<TripDashboard />} />
  </>
);

export default DiscoverRoutes;
