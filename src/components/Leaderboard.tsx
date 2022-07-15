import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { fetchAllUsers } from "../utils/dataFetcher";
import LoadingIndicator from "./LoadingIndicator";

type PlayerItemProps = {
  rank: number;
  player: PlayerUser;
};
const PlayerItem = (props: PlayerItemProps) => {
  const { rank, player } = props;

  const rankColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return "text-[#C9B037]";
      case 2:
        return "text-[#B4B4B4]";
      case 3:
        return "text-[#AD8A56]";
      default:
        return "";
    }
  };

  return (
    <Link to={`/profile/${player.id}`}>
      <div className="font-novaMono mb-2 hover:cursor-pointer hover:bg-primary/40 transition-all mx-2 flex flex-row items-center gap-5 lg:gap-11 bg-gray-400/40 backdrop-blur-sm py-2 px-6 rounded-lg">
        <h1 className={`text-4xl font-bold`}>
          <span className={rankColor(rank)}>{rank}</span>.
        </h1>
        <img
          className="object-cover rounded-full p-1 ring-2 hover:ring-4 transition-all ring-primary w-16 h-16"
          src={
            player.avatar ??
            "https://avatars.dicebear.com/api/big-ears-neutral/randomo.svg"
          }
          alt={`${player.name} avatar`}
          width={70}
          height={70}
        />
        <div className="flex-1 lg:w-72 overflow-hidden">
          <h1 className="text-xl font-bold text-ellipsis overflow-hidden">
            {player.name ?? "Unknown"}
          </h1>
          <p className="text-sm text-gray-400 text-ellipsis overflow-hidden h-5">
            {player.description ?? "Who might this be!?"}
          </p>
        </div>
        <h1 className="text-3xl font-bold">{player.score}p</h1>
      </div>
    </Link>
  );
};

type PlayerListProps = {
  players: PlayerUser[];
};
const PlayerList = (props: PlayerListProps) => {
  const { players } = props;
  players.sort((a, b) => b.score - a.score);
  return (
    <ul className="space-y-2">
      {players.map((player, index) => {
        return <PlayerItem key={index} rank={index + 1} player={player} />;
      })}
    </ul>
  );
};

const Leaderboard = () => {
  const {
    data: players,
    isLoading,
    error,
  } = useQuery("users", fetchAllUsers, { refetchInterval: 60 * 1000 });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full mb-6"
    >
      <PlayerList players={players} />
    </motion.div>
  );
};

export default Leaderboard;
