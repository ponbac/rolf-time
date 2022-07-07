import moment from "moment";
import { useEffect, useState } from "react";
import { fetchGames } from "../utils/dataFetcher";
import LoadingIndicator from "./LoadingIndicator";
import TeamFlag from "./TeamFlag";

type UpcomingGameProps = {
  offset?: number;
};
const UpcomingGame = (props: UpcomingGameProps) => {
  const { offset = 0 } = props;
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [date, setDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchGames().then((games) => {
      const sortedGames = games.sort((a, b) => a.date.localeCompare(b.date));

      let nextGameIndex = 0;
      for (const g of sortedGames) {
        if (moment(g.date).isAfter(moment())) {
          break;
        }
        nextGameIndex++;
      }

      const nextGame = sortedGames[nextGameIndex + offset];

      setGame(nextGame);
      setDate(moment(nextGame.date).format("dddd DD/MM, HH:mm"));
    });
  }, [game]);

  if (!game) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex flex-col items-center justify-center font-novaMono space-y-2">
      <div className="flex flex-row gap-4 justify-center items-center">
        <TeamFlag team={game.homeTeam} width={"3rem"} />
        <p className="font-bold text-3xl">vs</p>
        <TeamFlag team={game.awayTeam} width={"3rem"} />
      </div>
      <p className="text-sm">{date}</p>
    </div>
  );
};

const UpcomingGames = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-400/40 w-72 py-3 rounded-3xl font-novaMono space-y-4">
      <p className="font-bold text-xl">Upcoming:</p>
      <UpcomingGame />
      <UpcomingGame offset={1} />
    </div>
  );
};

export default UpcomingGames;
