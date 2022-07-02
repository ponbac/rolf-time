import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { fetchUser } from "../../utils/dataFetcher";

const UserProfile: FC<{}> = ({}) => {
  let params = useParams();
  const id = params.id;

  const [user, setUser] = useState<PlayerUser>();

  useEffect(() => {
    if (id != undefined) {
      fetchUser(id as string).then((u) => {
        setUser(u);
      });
    }
  }, [id]);

  if (!id) {
    return (
      <div className="font-mono flex flex-row items-center justify-center">
        No user name provided!
      </div>
    );
  }

  if (!user) {
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
    <div className="min-h-screen font-mono flex flex-col items-center justify-center my-6">
      <motion.div
        className="flex flex-col items-center justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="flex flex-col items-center justify-center font-mono bg-gray-500/70 backdrop-blur-sm rounded-xl p-10 w-80 h-96 overflow-hidden">
          <img
            className="object-cover h-36 w-36 rounded-full p-1 ring-2 hover:ring-8 transition-all ring-primary"
            src={
              user.avatar ??
              "https://avatars.dicebear.com/api/big-ears-neutral/randomo.svg"
            }
            alt={`${user.name} avatar`}
            width={120}
            height={120}
          />
          <div className="my-4">
            <h1 id="nameField" className="text-xl font-bold text-center">
              {user.name}
            </h1>
            <h1 id="descField" className="text-sm text-gray-400 text-center">
              {user.description}
            </h1>
          </div>
          <h1 className="text-center font-bold text-xl">Score: {user.score}</h1>
          <Link to={`/profile/${user.id}/predictions`}>
          <div className="mt-4 hover:cursor-pointer text-center bg-gradient-to-r from-primary to-secondary text-white transition-all w-36 hover:w-40 hover:text-gray-400 p-2 rounded-xl font-bold">
            Predictions
          </div>
        </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;
