import { motion } from "framer-motion";
import { FC } from "react";
import Header from "../components/Header";

const HoFItem: FC<{}> = () => {
  return (
    <div className="hover:bg-primary/40 transition-all mx-2 flex flex-row items-center justify-center gap-5 lg:gap-11 font-mono bg-gray-400/40 backdrop-blur-sm py-2 px-8 rounded-lg">
      <h1 className={`text-4xl font-bold text-center`}>🏆 EM 20/21</h1>
      <div className="text-center">
        <h1 className="text-xl font-bold">Jesper Kjellsson</h1>
        <h1 className="text-sm text-gray-400">Lord of Finland</h1>
      </div>
      <img
        className="rounded-full p-1 ring-2 hover:ring-4 transition-all ring-primary w-20 h-20 object-cover"
        src={"/kjelle.png"}
        alt={`kjelle avatar`}
        width={70}
        height={70}
      />
    </div>
  );
};

const HallOfFame: FC<{}> = () => {
  return (
    <motion.div
      className="flex flex-col flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header text="HALL OF FAME" />
      <div className="flex flex-col flex-0 justify-center items-center pt-20">
        <HoFItem />
      </div>
    </motion.div>
  );
};

export default HallOfFame;
