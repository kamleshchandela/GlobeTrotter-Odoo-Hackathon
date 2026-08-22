import { lazy } from "react";
import { Route } from "react-router-dom";

const HealthcareHome = lazy(() => import("../pages/healthcare/HealthcareHome"));
const DoctorProfile = lazy(() => import("../pages/healthcare/DoctorProfile"));
const HospitalProfile = lazy(() => import("../pages/healthcare/HospitalProfile"));
const Confirmation = lazy(() => import("../pages/healthcare/Confirmation"));
const HealthProfile = lazy(() => import("../pages/healthcare/HealthProfile"));

const HealthcareRoutes = () => (
  <>
    <Route path="/healthcare" element={<HealthcareHome />} />
    <Route path="/healthcare/doctor/:id" element={<DoctorProfile />} />
    <Route path="/healthcare/hospital/:id" element={<HospitalProfile />} />
    <Route path="/healthcare/confirmation" element={<Confirmation />} />
    <Route path="/healthcare/profile" element={<HealthProfile />} />
  </>
);

export default HealthcareRoutes;
