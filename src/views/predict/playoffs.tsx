import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { savePredictions } from "../../features/predict/predictSlice";
import { fetchGames } from "../../utils/dataFetcher";
import { useAppDispatch } from "../../utils/store";
import { GameBlock } from "./[groupId]";

type PlayoffsPredictItemProps = {
  game: Game;
};
const PlayoffsPredictItem = (props: PlayoffsPredictItemProps) => {
  const { game } = props;

  return (
    <div key={game.id}>
      <p>{game.date}</p>
      <p>
        {game.homeTeam?.name ?? "TBD"} vs {game.awayTeam?.name ?? "TBD"}
      </p>
    </div>
  );
};

const PredictPlayoffs = () => {
  const { data: games, isLoading, error } = useQuery("games", fetchGames);
  const [quarters, setQuarters] = useState<Game[]>([]);
  const [semis, setSemis] = useState<Game[]>([]);
  const [final, setFinal] = useState<Game[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (games) {
      setQuarters(
        games
          .filter((game) => game.groupId === "QUARTERS")
          .sort((a, b) => a.date.localeCompare(b.date))
      );
      setSemis(
        games
          .filter((game) => game.groupId === "SEMIS")
          .sort((a, b) => a.date.localeCompare(b.date))
      );
      setFinal(
        games
          .filter((game) => game.groupId === "FINAL")
          .sort((a, b) => a.date.localeCompare(b.date))
      );
    }
  }, [games]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center gap-4 font-novaMono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-center text-7xl font-bold font-novaMono pb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Playoffs
      </h1>
      {quarters.length > 0 && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold mb-4">Quarters</h2>
          {quarters.map((game) => (
            <GameBlock game={game} />
          ))}
        </div>
      )}
      {semis.length > 0 && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold mb-4">Semis</h2>
          {semis.map((game) => (
            <GameBlock game={game} />
          ))}
        </div>
      )}
      {final.length > 0 && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold mb-4">Final</h2>
          {final.map((game) => (
            <GameBlock game={game} />
          ))}
        </div>
      )}
      <Link to={"/"}>
        <button
          className="hover:cursor-pointer text-center bg-gradient-to-r from-primary to-secondary text-white transition-all w-32 hover:w-36 hover:text-gray-400 p-2 rounded-xl font-bold"
          onClick={() => dispatch(savePredictions())}
        >
          Save
        </button>
      </Link>
    </motion.div>
  );
};

export default PredictPlayoffs;
