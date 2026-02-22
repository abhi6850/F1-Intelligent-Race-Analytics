import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import History from "./pages/History";
import Drivers from "./pages/Drivers";
import Tyres from "./pages/Tyres";
import Tracks from "./pages/Tracks";
import Dashboard from "./pages/Dashboard";
import DriverDetail from "./pages/DriverDetail";



export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/history" element={<History />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/tyres" element={<Tyres />} />
        <Route path="/tracks" element={<Tracks />} />
        <Route path="/analytics" element={<Dashboard />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/drivers/:driverId" element={<DriverDetail />} />


      </Routes>
    </>
  );
}
