import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import About from "./pages/about";
import ScenarioSMS from "./pages/scenario_sms";
import FakeSmsChat from "./pages/scenarioSms/fake_sms_chat";
import Login from "./pages/registration/Login";
import Register from "./pages/registration/Registration";

const pageVariants = {
  initial: {
    opacity: 0,
    x: -50,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 50,
  },
};

const pageTransition = {
  duration: 0.35,
  ease: "easeInOut",
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <About />
            </motion.div>
          }
        />

        <Route
          path="/scenario_sms"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <ScenarioSMS />
            </motion.div>
          }
        />

        <Route
          path="/scenario/sms/:scenarioId"
            element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >       
              <FakeSmsChat />
            </motion.div>
        }
        />
        <Route
          path="/login"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <Login />
            </motion.div>
          }
        />
        
        <Route
          path="/register"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <Register />
            </motion.div>
          }
        />

      </Routes>

    </AnimatePresence>
  );
}

export default AnimatedRoutes;
