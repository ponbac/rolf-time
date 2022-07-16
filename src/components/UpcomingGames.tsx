import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { selectPredictions } from "../features/predict/predictSlice";
import { queryClient } from "../main";
import { fetchGames } from "../utils/dataFetcher";
import { useAppSelector } from "../utils/store";
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

  const findPrediction = (g: Game) => {
    const group = userPredictions.find((p) => p.groupId === g.groupId);
    if (group) {
      const prediction = group.games.find((p) => p.id === g.id);
      if (prediction) {
        return prediction;
      }
    }
  };

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
      if (moment(g.date).isAfter(moment().subtract(115, "minutes"))) {
        break;
      }
      nextGameIndex++;
    }

    const nextGame = sortedGames[nextGameIndex + offset];
    //const nextGame = sortedGames[4 + offset];

    setGame(nextGame);
    setDate(moment(nextGame.date).format("dddd DD/MM, HH:mm"));
    setPrediction(findPrediction(nextGame));
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

  return (
    <div className="flex flex-col items-center justify-center bg-gray-400/40 w-72 py-3 rounded-3xl font-novaMono">
      <p className="font-bold text-2xl text-center mb-2">Upcoming:</p>
      <UpcomingGame games={games} />
      <UpcomingGame games={games} offset={1} />
    </div>
  );
};

export default UpcomingGames;
