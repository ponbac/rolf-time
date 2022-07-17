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
import { findPrediction } from "../../utils/utils";
import { GameBlock } from "./[groupId]";

const PredictPlayoffs = () => {
  const { data: games, isLoading, error } = useQuery("games", fetchGames);
  const [quarters, setQuarters] = useState<Game[]>([]);
  const [semis, setSemis] = useState<Game[]>([]);
  const [final, setFinal] = useState<Game[]>([]);
  const [predictionsClosed, setPredictionsClosed] = useState<boolean>(false);

  const predictions = useAppSelector(selectPredictions);
  const dispatch = useAppDispatch();

  const calcSemifinals = () => {
    const teamOneId = findPrediction(quarters[0], predictions)?.winner;
    const teamTwoId = findPrediction(quarters[2], predictions)?.winner;
    const teamThreeId = findPrediction(quarters[1], predictions)?.winner;
    const teamFourId = findPrediction(quarters[3], predictions)?.winner;

    if (
      teamOneId == -1 ||
      teamTwoId == -1 ||
      teamThreeId == -1 ||
      teamFourId == -1
    ) {
      return [];
    }

    if (
      teamOneId != undefined &&
      teamTwoId != undefined &&
      teamThreeId != undefined &&
      teamFourId != undefined
    ) {
      const teamOne =
        quarters[0].homeTeam?.id == teamOneId
          ? quarters[0].homeTeam
          : quarters[0].awayTeam;
      const teamTwo =
        quarters[2].homeTeam?.id == teamTwoId
          ? quarters[2].homeTeam
          : quarters[2].awayTeam;
      const teamThree =
        quarters[1].homeTeam?.id == teamThreeId
          ? quarters[1].homeTeam
          : quarters[1].awayTeam;
      const teamFour =
        quarters[3].homeTeam?.id == teamFourId
          ? quarters[3].homeTeam
          : quarters[3].awayTeam;

      const semifinalOne: Game = {
        id: quarters[3].id + 1,
        date: "2022-07-26T21:00:00",
        homeTeam: teamOne,
        awayTeam: teamTwo,
        homeGoals: 0,
        awayGoals: 0,
        finished: false,
        winner: -1,
        groupId: "SEMIS",
      };
      const semifinalTwo: Game = {
        id: quarters[3].id + 2,
        date: "2022-07-27T21:00:00",
        homeTeam: teamThree,
        awayTeam: teamFour,
        homeGoals: 0,
        awayGoals: 0,
        finished: false,
        winner: -1,
        groupId: "SEMIS",
      };

      return [semifinalOne, semifinalTwo];
    }

    return [];
  };

  const calcFinal = () => {
    const teamOneId = findPrediction(semis[0], predictions)?.winner;
    const teamTwoId = findPrediction(semis[1], predictions)?.winner;

    if (teamOneId == -1 || teamTwoId == -1) {
      return [];
    }

    if (teamOneId != undefined && teamTwoId != undefined) {
      const teamOne =
        semis[0].homeTeam?.id == teamOneId
          ? semis[0].homeTeam
          : semis[0].awayTeam;
      const teamTwo =
        semis[1].homeTeam?.id == teamTwoId
          ? semis[1].homeTeam
          : semis[1].awayTeam;

      const final: Game = {
        id: semis[1].id + 1,
        date: "2022-07-31T18:00:00",
        homeTeam: teamOne,
        awayTeam: teamTwo,
        homeGoals: 0,
        awayGoals: 0,
        finished: false,
        winner: -1,
        groupId: "FINAL",
      };

      return [final];
    }

    return [];
  };

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
      setSemis(calcSemifinals());
      setFinal(calcFinal());
    }
  }, [games, predictions]);

  if (predictionsClosed) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-3">
        <h1 className="text-4xl font-bold font-novaMono">
          Predictions are currently closed!
        </h1>
        <h2 className="text-sm font-novaMono">
          Bracket stage predictions will open after the group stage is finished.
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
