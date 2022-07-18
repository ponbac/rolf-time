import { motion } from "framer-motion";
import moment from "moment";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import TeamFlag from "../components/TeamFlag";
import { TBD_TEAM } from "../utils/constants";
import { fetchAllUsers, fetchGame } from "../utils/dataFetcher";
import { findPrediction } from "../utils/utils";

type GameBoxProps = {
  game: Game;
};
const GameBox = (props: GameBoxProps) => {
  const { game } = props;

  if (game.homeTeam === null) {
    game.homeTeam = TBD_TEAM;
  }
  if (game.awayTeam === null) {
    game.awayTeam = TBD_TEAM;
  }

  return (
    <div className="flex flex-col items-center justify-center font-novaMono space-y-2">
      <div className="flex flex-row gap-4 justify-center items-center">
        <TeamFlag
          team={game.homeTeam}
          width={"5.5rem"}
          className="rounded-md"
        />
        <p className="font-bold text-3xl">vs</p>
        <TeamFlag
          team={game.awayTeam}
          width={"5.5rem"}
          className="rounded-md"
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        {game.finished && (
          <p className="text-3xl font-bold">
            {game.homeGoals} - {game.awayGoals}
          </p>
        )}
        <p className="text-lg text-center">
          {moment(game.date).format("dddd DD/MM, HH:mm")}
        </p>
      </div>
    </div>
  );
};

type PredictionsListProps = {
  users: PlayerUser[];
  game: Game;
  className?: string;
};
const PredictionsList = (props: PredictionsListProps) => {
  const { users, game, className } = props;

  const UserItem = (props: { user: PlayerUser; game: Game }) => {
    const { user, game } = props;
    const [prediction, setPrediction] = useState<GamePrediction | undefined>(
      undefined
    );

    const resultBgColor = () => {
      if (prediction && game.finished) {
        game.winner = game.winner == null ? -1 : game.winner;
        const correctPrediction = prediction.winner == game.winner;
        const correctScore =
          prediction.homeGoals == game.homeGoals &&
          prediction.awayGoals == game.awayGoals;
        if (correctScore) {
          return "bg-blue-400/40";
        } else if (correctPrediction) {
          return "bg-green-400/40";
        } else {
          return "bg-red-500/40";
        }
      }

      return "bg-gray-400/40";
    };

    useEffect(() => {
      if (user.predictions) {
        const prediction = findPrediction(game, user.predictions);
        setPrediction(prediction);
      }
    }, []);

    return (
      <Link to={`/profile/${user.id}`}>
        <div
          className={`${resultBgColor()} flex flex-row w-[22rem] lg:w-96 items-center rounded-xl gap-6 p-2 hover:bg-primary/40 transition-all`}
        >
          <img
            className="object-cover rounded-full p-1 ring-2 hover:ring-4 transition-all ring-primary w-16 h-16"
            src={
              user.avatar ??
              "https://avatars.dicebear.com/api/big-ears-neutral/randomo.svg"
            }
            alt={`${user.name} avatar`}
            width={70}
            height={70}
          />
          <p className="font-bold text-lg flex-1">
            {user.name}, {user.score}p
          </p>
          {prediction && (
            <p className="font-bold text-xl">
              ({prediction.homeGoals} - {prediction.awayGoals})
            </p>
          )}
        </div>
      </Link>
    );
  };

  if (!users) {
    return <LoadingIndicator />;
  }

  return (
    <div
      className={
        "flex flex-col justify-center items-center space-y-2 " + className ?? ""
      }
    >
      {users.map((user) => {
        return <UserItem user={user} game={game} key={user.id} />;
      })}
    </div>
  );
};

type GameViewProps = {};
const GameView = (props: GameViewProps) => {
  let params = useParams();
  const { id } = params;

  const [game, setGame] = useState<Game | undefined>(undefined);
  const { data: users } = useQuery("users", fetchAllUsers);

  useEffect(() => {
    if (id) {
      fetchGame(id).then((game) => {
        setGame(game);
      });
    }
  }, [id]);

  if (!game || !users) {
    return <LoadingIndicator fullscreen={true} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen font-novaMono">
        <GameBox game={game} />
        <PredictionsList users={users} game={game} className="mt-8" />
      </div>
    </motion.div>
  );
};

export default GameView;
