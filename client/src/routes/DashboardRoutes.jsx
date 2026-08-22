import { lazy } from "react";
import { Routes, Route } from "react-router-dom";


const HomePage = lazy(() => import("../pages/home/HomePage"));
const CompleteProfile = lazy(() => import("../pages/auth/CompleteProfile"));
const PermissionsSetup = lazy(() => import("../pages/onboarding/PermissionsSetup"));
const GlobalSearch = lazy(() => import("../pages/dashboard/GlobalSearch"));
const ProfilePage = lazy(() => import("../pages/account/ProfilePage"));
const PreferencesPage = lazy(() => import("../pages/account/PreferencesPage"));
const SavedCollectionPage = lazy(() => import("../pages/account/SavedCollectionPage"));
const TravelHistoryPage = lazy(() => import("../pages/account/TravelHistoryPage"));
const ReviewsPage = lazy(() => import("../pages/account/ReviewsPage"));
const SettingsPage = lazy(() => import("../pages/account/SettingsPage"));

const DashboardRoutes = () => (
  <>
    <Route path="/home" element={<HomePage />} />
    <Route path="/complete-profile" element={<CompleteProfile />} />
    <Route path="/onboarding/permissions" element={<PermissionsSetup />} />
    <Route path="/search" element={<GlobalSearch />} />
    <Route path="/account" element={<ProfilePage />} />
    <Route path="/account/profile" element={<ProfilePage />} />
    <Route path="/account/preferences" element={<PreferencesPage />} />
    <Route path="/account/saved" element={<SavedCollectionPage />} />
    <Route path="/account/history" element={<TravelHistoryPage />} />
    <Route path="/account/reviews" element={<ReviewsPage />} />
    <Route path="/account/settings" element={<SettingsPage />} />
  </>
);



export default DashboardRoutes;
