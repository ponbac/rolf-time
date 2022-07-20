import { motion } from "framer-motion";
import { useEffect } from "react";
import Header from "../components/Header";
import Leaderboard from "../components/Leaderboard";
import UpcomingGames from "../components/UpcomingGames";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="flex flex-col flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header text="[ENGLAND 2022]" />
      <div className="flex flex-col flex-0 justify-center items-center py-16 space-y-16">
        <UpcomingGames />
        <Leaderboard />
      </div>
    </motion.div>
  );
};

export default Home;
