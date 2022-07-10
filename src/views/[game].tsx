import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import TeamFlag from "../components/TeamFlag";
import { fetchAllUsers, fetchGame } from "../utils/dataFetcher";

type GameBoxProps = {
  game: Game;
};
const GameBox = (props: GameBoxProps) => {
  const { game } = props;

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
        <p className="text-lg text-center">
          {moment(game.date).format("dddd DD/MM, HH:mm")}
        </p>
      </div>
    </div>
  );
};

type PredictionsListProps = {
  game: Game;
  className?: string;
};
const PredictionsList = (props: PredictionsListProps) => {
  const { game, className } = props;
  const [users, setUsers] = useState<PlayerUser[] | undefined>(undefined);

  const UserItem = (props: { user: PlayerUser; game: Game }) => {
    const { user, game } = props;
    const [prediction, setPrediction] = useState<GamePrediction | undefined>(
      undefined
    );

    const findPrediction = (g: Game) => {
      if (user.predictions) {
        const group = user.predictions.find((p) => p.groupId === g.groupId);
        if (group) {
          const prediction = group.games.find((p) => p.id === g.id);
          if (prediction) {
            return prediction;
          }
        }
      }
    };

    useEffect(() => {
      const prediction = findPrediction(game);
      setPrediction(prediction);
    }, []);

    return (
      <Link to={`/profile/${user.id}`}>
        <div
          className={
            "flex flex-row w-[22rem] lg:w-96 items-center bg-gray-400/40 rounded-xl gap-6 p-2 hover:bg-primary/40 transition-all"
          }
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
          <p className="font-bold text-lg flex-1">{user.name}, {user.score}p</p>
          {prediction && (
            <p className="font-bold text-xl">
              ({prediction.homeGoals} - {prediction.awayGoals})
            </p>
          )}
        </div>
      </Link>
    );
  };

  useEffect(() => {
    fetchAllUsers().then((users) => {
      setUsers(users);
    });
  }, []);

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

  useEffect(() => {
    if (id) {
      fetchGame(id).then((game) => {
        setGame(game);
      });
    }
  }, [id]);

  if (!game) {
    return <LoadingIndicator fullscreen={true} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-novaMono">
      <GameBox game={game} />
      <PredictionsList game={game} className="mt-8" />
    </div>
  );
};

export default GameView;
