import { motion } from "framer-motion";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import TeamFlag from "../components/TeamFlag";
import { selectIsAdmin, selectUser } from "../features/auth/authSlice";
import { fetchGames, updateGame } from "../utils/dataFetcher";
import { useAppSelector } from "../utils/store";

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

type AdminControlsProps = {
  game: Game;
};
const AdminControls = (props: AdminControlsProps) => {
  const { game } = props;
  let date = moment(game.date).format("dddd DD/MM, HH:mm");
  const [homeGoals, setHomeGoals] = useState<number>(game.homeGoals);
  const [awayGoals, setAwayGoals] = useState<number>(game.awayGoals);

  type GoalButtonProps = {
    awayTeam?: boolean;
  };
  const AddButton = (props: GoalButtonProps) => {
    return (
      <button
        className="bg-green-600/60 hover:bg-green-500 text-white font-bold px-2 rounded-full transition-all"
        onClick={() => {
          if (props.awayTeam) {
            setAwayGoals(awayGoals + 1);
          } else {
            setHomeGoals(homeGoals + 1);
          }
        }}
      >
        +
      </button>
    );
  };
  const MinusButton = (props: GoalButtonProps) => {
    return (
      <button
        className="bg-red-600/60 hover:bg-red-500 text-white font-bold px-2 rounded-full transition-all"
        onClick={() => {
          if (props.awayTeam) {
            if (awayGoals > 0) {
              setAwayGoals(awayGoals - 1);
            }
          } else {
            if (homeGoals > 0) {
              setHomeGoals(homeGoals - 1);
            }
          }
        }}
      >
        -
      </button>
    );
  };

  const saveGame = async () => {
    let winner: number =
      homeGoals > awayGoals ? game.homeTeam.id : game.awayTeam.id;
    if (homeGoals === awayGoals) {
      winner = -1;
    }

    await updateGame(game.id, winner, homeGoals, awayGoals);
  };

  return (
    <div className="flex flex-col text-center items-center my-2">
      <p className="text-xs italic">{date}</p>
      <div className="flex flex-row items-center justify-center">
        <div className="mr-4 space-x-2">
          <MinusButton />
          <AddButton />
        </div>

        <p className="text-2xl">
          {homeGoals} - {awayGoals}
        </p>
        <div className="ml-4 space-x-2">
          <AddButton awayTeam={true} />
          <MinusButton awayTeam={true} />
        </div>
      </div>
      <button
        className="bg-gray-500 rounded-full w-20 font-mono text-sm hover:bg-slate-700 transition-all"
        onClick={() => saveGame()}
      >
        {game.finished ? "Update" : "Save"}
      </button>
    </div>
  );
};

const GameBlock: FC<{ game: Game }> = ({ game }) => {
  const isAdmin = useAppSelector(selectIsAdmin);

  let date = moment(game.date).format("dddd DD/MM, HH:mm");

  const MiddleSection = () => {
    if (isAdmin) {
      return <AdminControls game={game} />;
    }

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
    window.scrollTo(0, 0);
    setIsLoading(true);
    fetchGames().then((g) => {
      setGames(g);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingIndicator fullscreen={true} />;
  }

  return (
    <div className="min-h-screen font-mono flex flex-col items-center justify-center my-10">
      <motion.div
        className="flex flex-col items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold font-novaMono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
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
