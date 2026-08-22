import { lazy } from "react";
import { Route } from "react-router-dom";

const SafetyHome = lazy(() => import("../pages/safety/SafetyHome"));
const GuardianNetwork = lazy(() => import("../pages/safety/GuardianNetwork"));
const SOSDashboard = lazy(() => import("../pages/safety/SOSDashboard"));

const SafetyRoutes = () => (
  <>
    <Route path="/safety" element={<SafetyHome />} />
    <Route path="/safety/guardians" element={<GuardianNetwork />} />
    <Route path="/safety/sos" element={<SOSDashboard />} />
  </>
);

export default SafetyRoutes;
