import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

type PredictionsListProps = {};
const PredictionsList = (props: PredictionsListProps) => {
  const [users, setUsers] = useState<PlayerUser[] | undefined>(undefined);

  useEffect(() => {
    fetchAllUsers().then((users) => {
      setUsers(users);
    });
  }, []);

  if (!users) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {users.map((user) => {
        return <p>{user.name}</p>;
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
      <PredictionsList />
    </div>
  );
};

export default GameView;
