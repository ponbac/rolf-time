import { motion } from "framer-motion";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import TeamFlag from "../components/TeamFlag";
import { selectIsAdmin } from "../features/auth/authSlice";
import { TBD_TEAM } from "../utils/constants";
import { fetchGames, updateGame } from "../utils/dataFetcher";
import { useAppSelector } from "../utils/store";
import CollapsibleContainer from "../components/CollapsibleContainer";
import Header from "../components/Header";

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
      <p className="text-lg font-bold">{team.name}</p>
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

        <p className="text-2xl font-bold">
          {homeGoals} - {awayGoals}
        </p>
        <div className="ml-4 space-x-2">
          <AddButton awayTeam={true} />
          <MinusButton awayTeam={true} />
        </div>
      </div>
      <button
        className="bg-gray-500 rounded-full w-20 font-novaMono text-sm hover:bg-slate-700 transition-all"
        onClick={() => saveGame()}
      >
        {game.finished ? "Update" : "Save"}
      </button>
    </div>
  );
};

type GameBlockProps = {
  game: Game;
  adminMode?: boolean;
};
const GameBlock = (props: GameBlockProps) => {
  const { game, adminMode = false } = props;

  if (game.homeTeam === null) {
    game.homeTeam = TBD_TEAM;
  }
  if (game.awayTeam === null) {
    game.awayTeam = TBD_TEAM;
  }

  let date = moment(game.date).format("dddd DD/MM, HH:mm");

  const MiddleSection = () => {
    if (adminMode) {
      return <AdminControls game={game} />;
    }

    if (game.finished) {
      return (
        <div className="flex flex-col text-center w-44">
          <p className="text-2xl font-bold">
            {game.homeGoals} - {game.awayGoals}
          </p>
          <p className="text-sm italic">{date}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col text-center w-44">
        <p className="text-2xl font-bold">vs</p>
        <p className="text-sm italic">{date}</p>
      </div>
    );
  };

  const MainContent = () => {
    return (
      <div className="font-novaMono flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-8 mb-10 lg:mb-0">
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

  if (adminMode) {
    return <MainContent />;
  }

  return (
    <Link to={`/game/${game.id}`}>
      <div className=" p-2 font-novaMono flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-8 mb-6 lg:mb-0 hover:cursor-pointer hover:bg-gray-700/70 rounded-xl transition-all">
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
    </Link>
  );
};

const Schedule = () => {
  const { data: games, isLoading, error } = useQuery("games", fetchGames);
  const [finishedGames, setFinishedGames] = useState<Game[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const isAdmin = useAppSelector(selectIsAdmin);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (games) {
      setFinishedGames(
        games
          .filter((game) => game.finished)
          .sort((a, b) => a.date.localeCompare(b.date))
      );
      setUpcomingGames(
        games
          .filter((game) => !game.finished)
          .sort((a, b) => a.date.localeCompare(b.date))
      );
    }
  }, [games]);

  if (!games) {
    return <LoadingIndicator fullscreen={true} />;
  }

  return (
    <div className="font-novaMono flex flex-col items-center justify-center mb-10">
      <motion.div
        className="flex flex-col items-center justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header text={"SCHEDULE"} className={"mb-2 lg:mb-4"} />
        {isAdmin && (
          <button
            className="bg-secondary/40 p-2 rounded-xl font-bold hover:bg-secondary/80 transition-all text-center"
            onClick={() => setAdminMode(!adminMode)}
          >
            Toggle edit
          </button>
        )}
        <CollapsibleContainer
          title={"View played games"}
          titleClassName="font-bold"
          open={false}
        >
          {finishedGames.map((game) => (
            <GameBlock key={game.id} game={game} adminMode={adminMode} />
          ))}
        </CollapsibleContainer>
        {upcomingGames.map((game) => (
          <GameBlock key={game.id} game={game} adminMode={adminMode} />
        ))}
      </motion.div>
    </div>
  );
};

export default Schedule;
