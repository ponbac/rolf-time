import { motion } from "framer-motion";
import { FC } from "react";
import Header from "../components/Header";

type HoFItemProps = {
  tournament: string;
  name: string;
  description: string;
  image: string;
};
const HoFItem = (props: HoFItemProps) => {
  const { tournament, name, description, image } = props;

  return (
    <div className="max-w-2xl hover:bg-primary/40 transition-all mx-2 flex flex-row items-center justify-center gap-5 lg:gap-11 font-novaMono bg-gray-400/40 backdrop-blur-sm py-2 px-8 rounded-lg">
      <h1 className={`text-4xl font-bold text-center`}>🏆 {tournament}</h1>
      <div className="text-center">
        <h1 className="text-xl font-bold">{name}</h1>
        <h1 className="text-sm text-gray-400">{description}</h1>
      </div>
      <img
        className="rounded-full p-1 ring-2 hover:ring-4 transition-all ring-primary w-20 h-20 object-cover"
        src={image}
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
      <div className="flex flex-col flex-0 justify-center items-center pt-20 space-y-2">
        <HoFItem
          tournament="DAM-EM 22"
          name="Pontus Backman"
          description="Non-believer"
          image="/images/gintama.gif"
        />
        <HoFItem
          tournament="EM 20/21"
          name="Jesper Kjellsson"
          description="Lord of Finland"
          image="/images/kjelle.png"
        />
        <img
          className="w-min mt-8"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif"
          alt="Gengar"
        />
      </div>
    </motion.div>
  );
};

export default HallOfFame;
