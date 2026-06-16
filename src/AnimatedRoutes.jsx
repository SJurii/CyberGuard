import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import About from "./pages/about";
import ScenarioSMS from "./pages/scenario_sms";
import FakeSmsChat from "./pages/scenarioSms/fake_sms_chat";
import Login from "./pages/registration/Login";
import Register from "./pages/registration/Registration";
import Profile from "./pages/profile/profile";
import MapPage from "./pages/map/map";
import Leaderboard from "./pages/leader_board/leader_board";
import ScenarioEmail from "./pages/scenarioEmail/scenario_email";
import Dashboard from "./pages/main/Dashboard";
import EmailScenarioPlayer from "./pages/scenarioEmail/EmailScenarioPlayer/email_scenario_player";
import AdminAchievementsPage from "./pages/adminAchivement/AdminAchievementsPage";
import AdminUsersPage from "./pages/adminUsersPage/adminUsersPage";
import SqcenarioSql from "./pages/scenarioSQL/infoSQL";
import PlayerSQL from "./pages/scenarioSQL/playerSQL";
import ScenarioSocial from "./pages/scenarioSocial/socialInfo";
import SocialPlayer from "./pages/scenarioSocial/ScenarioSocialPlayer";

const pageVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const pageTransition = { duration: 0.35, ease: "easeInOut" };

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Главная и инфо */}
        <Route path="/" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />

        {/* Списки сценариев по категориям */}
        <Route path="/scenario_sms" element={<PageWrapper><ScenarioSMS /></PageWrapper>} />
        <Route path="/scenario/email" element={<PageWrapper><ScenarioEmail /></PageWrapper>} />
        <Route path="/adminAchievements" element={<PageWrapper><AdminAchievementsPage /></PageWrapper>} />
        <Route path="scenarioSQL/infoSQL" element={<PageWrapper><SqcenarioSql /></PageWrapper>} />
        <Route path="scenarioSQL/playerSQL/:scenarioId" element={<PageWrapper><PlayerSQL /></PageWrapper>} />
        <Route path="/scenario/social/info" element={<PageWrapper><ScenarioSocial /></PageWrapper>} />
        <Route path="/scenario/social/:scenarioId" element={<PageWrapper><SocialPlayer /></PageWrapper>} />

        <Route path="/scenario/sms/:scenarioId" element={<PageWrapper><FakeSmsChat /></PageWrapper>} />

        <Route path="/scenario/email/:scenarioId" element={<PageWrapper><EmailScenarioPlayer /></PageWrapper>} />
        <Route path="/admin/users" element={<PageWrapper><AdminUsersPage /></PageWrapper>} />


        <Route path="/map" element={<PageWrapper><MapPage /></PageWrapper>} />
        <Route path="/profile/leaderboard" element={<PageWrapper><Leaderboard /></PageWrapper>} />

        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/profile/:id" element={<PageWrapper><Profile /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

export default AnimatedRoutes;