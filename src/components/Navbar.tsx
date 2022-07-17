import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, signedOut } from "../features/auth/authSlice";
import { SUPABASE } from "../utils/dataFetcher";
import { useWindowDimensions } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCalendar,
  faDice,
  faHouse,
  faTrophy,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

enum MenuItem {
  Home,
  Predict,
  Schedule,
  HallOfFame,
  NONE,
}

const Navbar: FC<{}> = ({}) => {
  const { height, width } = useWindowDimensions();
  const user = useSelector(selectUser);
  const location = useLocation();
  const dispatch = useDispatch();

  const [activeItem, setActiveItem] = useState<MenuItem>(MenuItem.NONE);

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

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setActiveItem(MenuItem.Home);
        break;
      case "/predict":
        setActiveItem(MenuItem.Predict);
        break;
      case "/schedule":
        setActiveItem(MenuItem.Schedule);
        break;
      case "/halloffame":
        setActiveItem(MenuItem.HallOfFame);
        break;
      default:
        setActiveItem(MenuItem.NONE);
        break;
    }
  }, [location]);

  if (width <= 1024) {
    const MobileLink = (props: {
      to: string;
      icon: IconDefinition;
      menuItem: MenuItem;
      text: string;
    }) => {
      const { to, icon, menuItem, text } = props;

      return (
        <Link to={to}>
          <div
            className={`${
              activeItem == menuItem ? "text-blue-400" : ""
            } flex flex-col items-center hover:cursor-pointer hover:italic`}
          >
            <FontAwesomeIcon icon={icon} className="text-xl p-1" />
            <p className="text-white text-xs font-novaMono font-bold">{text}</p>
          </div>
        </Link>
      );
    };

    return (
      <div className="items-center flex flex-row min-w-full bg-gradient-to-r from-primary to-[#001E6C] h-16 z-10 px-3">
        <Link to={`/profile/update`}>
          <img
            className="object-cover h-12 w-12 rounded-full p-1 ring-2 ring-secondary transition-all hover:cursor-pointer hover:ring-4"
            src={
              user && user?.avatar
                ? user.avatar
                : "https://avatars.dicebear.com/api/big-ears-neutral/Bakuman.svg"
            }
            alt={`Avatar`}
            width={60}
            height={60}
          />
        </Link>
        <div className="flex flex-row flex-1 gap-6 justify-evenly pl-3">
          <MobileLink
            to="/"
            icon={faHouse}
            menuItem={MenuItem.Home}
            text="Home"
          />
          <MobileLink
            to="/predict"
            icon={faDice}
            menuItem={MenuItem.Predict}
            text="Predict"
          />
          <MobileLink
            to="/schedule"
            icon={faCalendar}
            menuItem={MenuItem.Schedule}
            text="Schedule"
          />
          <MobileLink
            to="/halloffame"
            icon={faTrophy}
            menuItem={MenuItem.HallOfFame}
            text="HoF"
          />
          <div
            onClick={handleSignOutClick}
            className="flex flex-col items-center hover:cursor-pointer hover:italic"
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="text-xl p-1"
            />
            <p className="text-xs font-novaMono font-bold">Exit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-24 bg-gradient-to-l from-primary to-[#001E6C] items-center">
      <Link to={`/profile/update`}>
        <img
          className="object-cover h-16 w-16 mt-6 rounded-full p-1 ring-2 ring-secondary transition-all hover:cursor-pointer hover:ring-4"
          src={
            user && user?.avatar
              ? user?.avatar
              : "https://avatars.dicebear.com/api/big-ears-neutral/Bakuman.svg"
          }
          alt={`Avatar`}
          width={60}
          height={60}
        />
      </Link>

      <Link to="/">
        <div
          className={`${
            activeItem == MenuItem.Home ? "text-blue-400" : ""
          } mt-12 flex flex-col items-center hover:cursor-pointer hover:italic`}
        >
          <FontAwesomeIcon icon={faHouse} className="text-xl p-1" />
          <p className="text-white font-semibold text-sm font-novaMono">Home</p>
        </div>
      </Link>
      <Link to="/predict">
        <div
          className={`${
            activeItem == MenuItem.Predict ? "text-blue-400" : ""
          } mt-4 flex flex-col items-center hover:cursor-pointer hover:italic`}
        >
          <FontAwesomeIcon icon={faDice} className="text-xl p-1" />
          <p className="text-white font-semibold text-sm font-novaMono">
            Predict
          </p>
        </div>
      </Link>
      <Link to="/schedule">
        <div
          className={`${
            activeItem == MenuItem.Schedule ? "text-blue-400" : ""
          } mt-4 flex flex-col items-center hover:cursor-pointer hover:italic`}
        >
          <FontAwesomeIcon icon={faCalendar} className="text-xl p-1" />
          <p className="text-white font-semibold text-sm font-novaMono">
            Schedule
          </p>
        </div>
      </Link>
      <Link to="/halloffame">
        <div
          className={`${
            activeItem == MenuItem.HallOfFame ? "text-blue-400" : ""
          } mt-4 flex flex-col items-center hover:cursor-pointer hover:italic`}
        >
          <FontAwesomeIcon icon={faTrophy} className="text-xl p-1" />
          <p className="text-white font-semibold text-sm font-novaMono">HoF</p>
        </div>
      </Link>
      <div
        onClick={handleSignOutClick}
        className="absolute bottom-3 mt-4 flex flex-col items-center hover:cursor-pointer hover:italic"
      >
        <FontAwesomeIcon
          icon={faArrowRightFromBracket}
          className="text-xl p-1"
        />
        <p className="text-white font-semibold text-sm font-novaMono">Logout</p>
      </div>
    </div>
  );
};

export default Navbar;
