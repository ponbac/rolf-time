import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { fetchGames, fetchUser } from "../../utils/dataFetcher";
import TeamFlag from "../../components/TeamFlag";
import { TeamBlock } from "../predict/[groupId]";

type PredictedGroupProps = {
  groupName: string;
  teams: Team[];
};
const PredictedGroup = (props: PredictedGroupProps) => {
  const { teams, groupName } = props;

  const TeamItem = (props: { team: Team; placing: number; key: string }) => {
    return (
      <div
        className="gap-2 w-56 hover:bg-primary/30 transition-all mx-2 flex flex-row items-center font-mono bg-gray-400/30 backdrop-blur-sm py-2 px-4 rounded-lg"
        key={props.key}
      >
        <p className={"font-bold"}>{props.placing}.</p>
        <TeamFlag team={props.team} width="2.0rem" />
        <h1>{props.team.name}</h1>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-bold font-mono">Group {groupName}</p>
      <div className="pt-2 space-y-1">
        {teams.map((team, placing) => (
          <TeamItem team={team} placing={placing + 1} key={team.name} />
        ))}
      </div>
    </div>
  );
};

type PredictedGamesProps = {
  predictions: GroupPrediction[];
};
const PredictedGames = (props: PredictedGamesProps) => {
  const { predictions } = props;
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetchGames().then((games) => {
      if (games) {
        setGames(games);
      }
    });
  }, []);

  const PredictionItem = (props: {
    prediction: GamePrediction;
    key: string;
  }) => {
    const { prediction } = props;
    const game = games.find((g) => g.id === props.prediction.id);

    if (!game) {
      return null;
    }

    return (
      <div className="font-mono flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-8 mb-10 lg:mb-0">
        <TeamBlock
          team={game.homeTeam}
          away={false}
          selected={game.homeTeam.id == prediction.winner}
        />
        <div className="flex flex-col text-center">
          <div className="flex flex-row items-center justify-center">
            <p className="text-2xl">
              {prediction.homeGoals} - {prediction.awayGoals}
            </p>
          </div>
        </div>
        <TeamBlock
          team={game.awayTeam}
          away={true}
          selected={game.awayTeam.id == prediction.winner}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="py-2 space-y-8">
        {predictions.map((p) => (
          <div className="flex flex-col gap-2 justify-center items-center">
            <p className="text-xl font-bold font-mono">Group {p.groupId}</p>
            {p.games.map((gamePrediction) => (
              <PredictionItem
                prediction={gamePrediction}
                key={gamePrediction.id.toString()}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const UserPredictions = () => {
  let params = useParams();
  const id = params.id;

  const [predictions, setPredictions] = useState<GroupPrediction[]>();
  const [user, setUser] = useState<PlayerUser>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id != undefined) {
      fetchUser(id as string).then((u) => {
        setUser(u);
        if (u.predictions != undefined && u.predictions.length > 0) {
          setPredictions(u.predictions);
        }
        setIsLoading(false);
      });
    }
  }, [id]);

  if (!id) {
    return (
      <div className="font-mono flex flex-row items-center justify-center">
        No user ID!
      </div>
    );
  }

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

  if (!isLoading && predictions == undefined) {
    return (
      <div className="font-mono flex flex-row items-center justify-center min-h-screen text-4xl">
        This user has no predictions saved!
      </div>
    );
  }

  return (
    <div className="min-h-screen font-mono flex flex-col items-center justify-center my-6">
      <motion.div
        className=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="flex flex-col items-center justify-center">
          <p className="text-7xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            {user?.name}
          </p>
          <p className="text-3xl font-bold font-mono italic">{user?.score}p</p>
        </div>
        {predictions && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 my-6">
              {predictions.map((p) => (
                <PredictedGroup groupName={p.groupId} teams={p.result} />
              ))}
            </div>
            <div className="flex flex-col justify-center items-center">
              <PredictedGames predictions={predictions} />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default UserPredictions;
