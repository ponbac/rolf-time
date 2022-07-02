import { FC, useState } from "react";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ScheduleIcon from "@mui/icons-material/Schedule";
import HomeIcon from "@mui/icons-material/Home";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, signedOut } from "../features/auth/authSlice";
import { SUPABASE } from "../utils/dataFetcher";
import { useWindowDimensions } from "../utils/utils";

enum MenuItem {
  Home,
  Predict,
  Schedule,
  HallOfFame,
}

const Navbar: FC<{}> = ({}) => {
  const { height, width } = useWindowDimensions();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  // TODO: Highlight active menu item
  const [activeItem, setActiveItem] = useState<MenuItem>();

  async function signOut() {
    const { error } = await SUPABASE.auth.signOut();

    dispatch(signedOut());
  }

  const handleSignOutClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
  };

  if (width <= 1024) {
    return (
      <div className="items-center flex flex-row min-w-full bg-gradient-to-r from-primary to-secondary h-16 z-10 px-3">
        <Link to={`/profile/update`}>
          <img
            className="object-cover h-12 w-12 rounded-full p-1 ring-2 ring-secondary transition-all hover:cursor-pointer hover:ring-4"
            src={
              user
                ? user.avatar
                : "https://avatars.dicebear.com/api/big-ears-neutral/Bakuman.svg"
            }
            alt={`Avatar`}
            width={60}
            height={60}
          />
        </Link>
        <div className="flex flex-row flex-1 gap-6 justify-evenly pl-3">
          <Link to="/">
            <div className="flex flex-col items-center hover:cursor-pointer hover:italic">
              <HomeIcon className="fill-white w-14 h-14 transition-all " />
              <p className="text-xs font-mono font-bold">Home</p>
            </div>
          </Link>
          <Link to="/predict">
            <div className="flex flex-col items-center hover:cursor-pointer hover:italic">
              <SportsSoccerIcon className="fill-white w-14 h-14 transition-all " />
              <p className="text-xs font-mono font-bold">Predict</p>
            </div>
          </Link>
          <Link to="/schedule">
            <div className="flex flex-col items-center hover:cursor-pointer hover:italic">
              <ScheduleIcon className="fill-white w-14 h-14 transition-all " />
              <p className="text-xs font-mono font-bold">Schedule</p>
            </div>
          </Link>
          <Link to="/halloffame">
            <div className="flex flex-col items-center hover:cursor-pointer hover:italic">
              <EmojiEventsIcon className="fill-white w-14 h-14 transition-all " />
              <p className="text-xs font-mono font-bold">HoF</p>
            </div>
          </Link>
          <div
            onClick={handleSignOutClick}
            className="flex flex-col items-center hover:cursor-pointer hover:italic"
          >
            <LogoutIcon className="fill-white w-14 h-14 transition-all " />
            <p className="text-xs font-mono font-bold">Exit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-24 bg-gradient-to-l from-primary to-secondary items-center">
      <Link to={`/profile/update`}>
        <img
          className="object-cover h-16 w-16 mt-6 rounded-full p-1 ring-2 ring-secondary transition-all hover:cursor-pointer hover:ring-4"
          src={
            user
              ? user.avatar
              : "https://avatars.dicebear.com/api/big-ears-neutral/Bakuman.svg"
          }
          alt={`Avatar`}
          width={60}
          height={60}
        />
      </Link>

      <Link to="/">
        <div className="mt-12 flex flex-col items-center hover:cursor-pointer hover:italic">
          <HomeIcon className="fill-white w-14 h-14 transition-all " />
          <p className="text-white font-semibold text-sm font-mono">Home</p>
        </div>
      </Link>
      <Link to="/predict">
        <div className="mt-4 flex flex-col items-center hover:cursor-pointer hover:italic">
          <SportsSoccerIcon className="fill-white w-14 h-14 transition-all " />
          <p className="text-white font-semibold text-sm font-mono">Predict</p>
        </div>
      </Link>
      <Link to="/schedule">
        <div className="mt-4 flex flex-col items-center hover:cursor-pointer hover:italic">
          <ScheduleIcon className="fill-white w-14 h-14 transition-all " />
          <p className="text-white font-semibold text-sm font-mono">Schedule</p>
        </div>
      </Link>
      <Link to="/halloffame">
        <div className="mt-4 flex flex-col items-center hover:cursor-pointer hover:italic">
          <EmojiEventsIcon className="fill-white w-14 h-14 transition-all " />
          <p className="text-white font-semibold text-sm font-mono">HoF</p>
        </div>
      </Link>
      <div
        onClick={handleSignOutClick}
        className="absolute bottom-3 mt-4 flex flex-col items-center hover:cursor-pointer hover:italic"
      >
        <LogoutIcon className="fill-white w-14 h-14 transition-all " />
        <p className="text-white font-semibold text-sm font-mono">Logout</p>
      </div>
    </div>
  );
};

export default Navbar;
