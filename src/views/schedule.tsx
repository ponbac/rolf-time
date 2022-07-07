import { motion } from "framer-motion";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import TeamFlag from "../components/TeamFlag";
import { fetchGames } from "../utils/dataFetcher";

type TeamBlockProps = {
  team: Team;
  winner?: boolean;
};
const TeamBlock = (props: TeamBlockProps) => {
  const { team, winner = false } = props;
  const flagWidth = "2.25rem";

  const bgColor = winner ? "bg-green-600/60" : "bg-gray-400/30";
  return (
    <div
      className={
        "gap-2 backdrop-blur-sm py-2 px-4 flex flex-row items-center justify-between w-64 p-4 rounded-xl transition-all " +
        bgColor
      }
    >
      <p className="text-lg font-normal">{team.name}</p>
      <TeamFlag team={team} width={flagWidth} />
    </div>
  );
};

const GameBlock: FC<{ game: Game }> = ({ game }) => {
  let date = moment(game.date).format("dddd DD/MM, HH:mm");

  const MiddleSection = () => {
    if (game.finished) {
      return (
        <div className="flex flex-col text-center w-44">
          <p className="text-2xl">
            {game.homeGoals} - {game.awayGoals}
          </p>
          <p className="text-xs italic">{date}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col text-center w-44">
        <p className="text-2xl">vs</p>
        <p className="text-xs italic">{date}</p>
      </div>
    );
  };

  return (
    <div className="font-mono flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-8 mb-10 lg:mb-0">
      <TeamBlock
        team={game.homeTeam}
        winner={game.winner == game.homeTeam.id}
      />
      <MiddleSection />
      <TeamBlock
        team={game.awayTeam}
        winner={game.winner == game.awayTeam.id}
      />
    </div>
  );
};

const Schedule: FC<{}> = ({}) => {
  //const { games, isLoading, isError } = useGames();
  const [games, setGames] = useState<Game[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    fetchGames().then((g) => {
      setGames(g);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="loading-indicator">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-mono flex flex-col items-center justify-center my-10">
      <motion.div
        className="flex flex-col items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
          Schedule
        </h1>
        {games &&
          games
            ?.sort((a, b) => a.date.localeCompare(b.date))
            .map((game) => <GameBlock key={game.id} game={game} />)}
      </motion.div>
    </div>
  );
};

export default Schedule;
