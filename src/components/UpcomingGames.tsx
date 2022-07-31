import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { selectPredictions } from "../features/predict/predictSlice";
import { TBD_TEAM } from "../utils/constants";
import { fetchGames } from "../utils/dataFetcher";
import { useAppSelector } from "../utils/store";
import { findPrediction } from "../utils/utils";
import LoadingIndicator from "./LoadingIndicator";
import TeamFlag from "./TeamFlag";

type UpcomingGameProps = {
  games: Game[];
  offset?: number;
};
const UpcomingGame = (props: UpcomingGameProps) => {
  const { games, offset = 0 } = props;
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [date, setDate] = useState<string | undefined>(undefined);
  const [prediction, setPrediction] = useState<GamePrediction | undefined>(
    undefined
  );

  const userPredictions = useAppSelector(selectPredictions);

  const resultTextColor = () => {
    if (prediction && game?.finished) {
      game.winner = game.winner == null ? -1 : game.winner;
      const correctPrediction = prediction.winner == game.winner;
      const correctScore =
        prediction.homeGoals == game.homeGoals &&
        prediction.awayGoals == game.awayGoals;
      if (correctScore) {
        return "text-blue-400";
      } else if (correctPrediction) {
        return "text-green-500";
      } else {
        return "text-red-600/80";
      }
    }
  };

  useEffect(() => {
    const sortedGames = games.sort((a, b) => a.date.localeCompare(b.date));

    let nextGameIndex = 0;
    for (const g of sortedGames) {
      if (moment(g.date).isAfter(moment().subtract(135, "minutes"))) {
        break;
      }
      nextGameIndex++;
    }

    const nextGame = sortedGames[nextGameIndex + offset];
    //const nextGame = sortedGames[4 + offset];

    if (nextGame.homeTeam === null) {
      nextGame.homeTeam = TBD_TEAM;
    }
    if (nextGame.awayTeam === null) {
      nextGame.awayTeam = TBD_TEAM;
    }

    setGame(nextGame);
    setDate(moment(nextGame.date).format("dddd DD/MM, HH:mm"));
    setPrediction(findPrediction(nextGame, userPredictions));
  }, [games]);

  if (!game) {
    return <LoadingIndicator />;
  }

  return (
    <Link to={`/game/${game.id}`}>
      <div className="flex flex-col items-center justify-center font-novaMono space-y-2 hover:bg-gray-700/70 rounded-xl transition-all p-2">
        <div className="flex flex-row gap-4 justify-center items-center">
          <TeamFlag
            team={game.homeTeam}
            width={"3.5rem"}
            className="rounded-md"
          />
          <p className="font-bold text-3xl">vs</p>
          <TeamFlag
            team={game.awayTeam}
            width={"3.5rem"}
            className="rounded-md"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          {game.finished && (
            <p className={`font-bold text-3xl ${resultTextColor()}`}>
              {game.homeGoals} - {game.awayGoals}
            </p>
          )}
          <p className="text-md text-center">{date}</p>
          {prediction && (
            <p className="text-sm italic text-center">
              Prediction: ({prediction.homeGoals} - {prediction.awayGoals})
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

const UpcomingGames = () => {
  const {
    data: games,
    isLoading,
    error,
  } = useQuery("games", fetchGames, { refetchInterval: 60 * 1000 });

  if (!games) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-400/40 w-72 py-3 rounded-3xl font-novaMono space-y-4">
        <LoadingIndicator />
      </div>
    );
  }

  // TODO: This solution crashes in the edge case where there are still unfinished games
  //       while no game is left to play according to the games' start time.
  return (
    <>
      {games.filter((g) => !g.finished).length > 0 && (
        <div className="flex flex-col items-center justify-center bg-gray-400/40 w-72 py-3 rounded-3xl font-novaMono">
          <p className="font-bold text-2xl text-center mb-2">Upcoming:</p>
          <UpcomingGame games={games} />
          {games.filter((g) => !g.finished).length > 1 && (
            <UpcomingGame games={games} offset={1} />
          )}
        </div>
      )}
    </>
  );
};

export default UpcomingGames;
