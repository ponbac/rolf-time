import moment from "moment";
import { useEffect, useState } from "react";
import { selectPredictions } from "../features/predict/predictSlice";
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

  useEffect(() => {
    const sortedGames = games.sort((a, b) => a.date.localeCompare(b.date));

    let nextGameIndex = 0;
    for (const g of sortedGames) {
      if (moment(g.date).isAfter(moment().add(105, "minutes"))) {
        break;
      }
      nextGameIndex++;
    }

    const nextGame = sortedGames[nextGameIndex + offset];

    setGame(nextGame);
    setDate(moment(nextGame.date).format("dddd DD/MM, HH:mm"));
    setPrediction(findPrediction(nextGame));
  }, [game]);

  if (!game) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex flex-col items-center justify-center font-novaMono space-y-2">
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
        <p className="text-md text-center">{date}</p>
        {prediction && (
          <p className="text-sm italic text-center">
            Prediction: ({prediction.homeGoals} - {prediction.awayGoals})
          </p>
        )}
      </div>
    </div>
  );
};

const UpcomingGames = () => {
  const [games, setGames] = useState<Game[] | undefined>(undefined);

  useEffect(() => {
    fetchGames().then((games) => {
      if (games) {
        setGames(games);
      }
    });
  }, []);

  if (!games) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-400/40 w-72 py-3 rounded-3xl font-novaMono space-y-4">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-400/40 w-72 py-3 rounded-3xl font-novaMono space-y-4">
      <p className="font-bold text-2xl text-center">Upcoming:</p>
      <UpcomingGame games={games} />
      <UpcomingGame games={games} offset={1} />
    </div>
  );
};

export default UpcomingGames;
