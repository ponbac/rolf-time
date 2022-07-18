import { motion } from "framer-motion";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  savePredictions,
  selectPredictions,
} from "../../features/predict/predictSlice";
import { PLAYOFF_PREDICTIONS_CLOSE } from "../../utils/constants";
import { fetchGames } from "../../utils/dataFetcher";
import { useAppDispatch, useAppSelector } from "../../utils/store";
import { calcSemifinals, calcFinal } from "../../utils/utils";
import { GameBlock } from "./[groupId]";

const PredictPlayoffs = () => {
  const { data: games, isLoading, error } = useQuery("games", fetchGames);
  const [quarters, setQuarters] = useState<Game[]>([]);
  const [semis, setSemis] = useState<Game[]>([]);
  const [final, setFinal] = useState<Game[]>([]);
  const [predictionsClosed, setPredictionsClosed] = useState<boolean>(false);

  const predictions = useAppSelector(selectPredictions);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const currentTime = moment();
    if (currentTime.isAfter(PLAYOFF_PREDICTIONS_CLOSE)) {
      setPredictionsClosed(true);
    }

    if (games) {
      setQuarters(
        games
          .filter((game) => game.groupId === "QUARTERS")
          .sort((a, b) => a.date.localeCompare(b.date))
      );
      setSemis(calcSemifinals(quarters, predictions));
      setFinal(calcFinal(semis, predictions));
    }
  }, [games, predictions]);

  if (predictionsClosed) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-3">
        <h1 className="text-4xl font-bold font-novaMono">
          Predictions are currently closed!
        </h1>
        <h2 className="text-sm font-novaMono">
          All you can do is wait for the final results.
        </h2>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center gap-4 font-novaMono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-center text-7xl font-bold font-novaMono pb-3 pt-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        Playoffs
      </h1>
      <h2 className=" text-lg px-2 text-center font-bold">
        Correct winner grants 6 points in quarters, 8 points in semis and 10
        points in the final. <br /> +3 for correct score. <br />{" "}
        <span className="italic text-base">
          (Score includes potential goals scored after ordinary game time, e.g.
          penalty shoot-out)
        </span>
      </h2>
      {quarters.length > 0 && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold mb-4">Quarters</h2>
          {quarters.map((game) => (
            <GameBlock game={game} />
          ))}
        </div>
      )}
      {semis.length > 0 && (
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">Semis</h2>
          {semis.map((game) => (
            <GameBlock game={game} />
          ))}
        </motion.div>
      )}
      {final.length > 0 && (
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-4">Final</h2>
          {final.map((game) => (
            <GameBlock game={game} />
          ))}
        </motion.div>
      )}
      <Link to={"/"}>
        <button
          className="hover:cursor-pointer text-center bg-gradient-to-r from-primary to-secondary text-white transition-all w-32 hover:w-36 hover:text-gray-400 p-2 mb-2 rounded-xl font-bold"
          onClick={() => dispatch(savePredictions())}
        >
          Save
        </button>
      </Link>
    </motion.div>
  );
};

export default PredictPlayoffs;
