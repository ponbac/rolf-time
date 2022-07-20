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
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
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
    const MobileLinkIcon = (props: {
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
            } flex flex-col items-center hover:cursor-pointer hover:text-blue-300`}
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
        <div className="flex flex-row flex-1 gap-3 sm:gap-6 justify-evenly pl-3">
          <MobileLinkIcon
            to="/"
            icon={faHouse}
            menuItem={MenuItem.Home}
            text="Home"
          />
          <MobileLinkIcon
            to="/predict"
            icon={faDice}
            menuItem={MenuItem.Predict}
            text="Predict"
          />
          <MobileLinkIcon
            to="/schedule"
            icon={faCalendar}
            menuItem={MenuItem.Schedule}
            text="Schedule"
          />
          <MobileLinkIcon
            to="/halloffame"
            icon={faTrophy}
            menuItem={MenuItem.HallOfFame}
            text="HoF"
          />
          <button
            onClick={handleSignOutClick}
            className="flex flex-col items-center hover:cursor-pointer hover:text-blue-300"
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="text-xl p-1"
            />
            <p className="text-xs font-novaMono font-bold">Exit</p>
          </button>
        </div>
      </div>
    );
  }

  const DesktopLinkIcon = (props: {
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
          } mt-4 flex flex-col items-center hover:cursor-pointer hover:text-blue-300`}
        >
          <FontAwesomeIcon icon={icon} className="text-xl p-1" />
          <p className="text-white font-semibold text-sm font-novaMono">
            {text}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col min-h-screen w-24 bg-gradient-to-l from-primary to-[#001E6C] items-center">
      <Link to={`/profile/update`}>
        <img
          className="object-cover h-16 w-16 mt-6 mb-8 rounded-full p-1 ring-2 ring-secondary transition-all hover:cursor-pointer hover:ring-4"
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

      <DesktopLinkIcon
        to="/"
        icon={faHouse}
        menuItem={MenuItem.Home}
        text="Home"
      />
      <DesktopLinkIcon
        to="/predict"
        icon={faDice}
        menuItem={MenuItem.Predict}
        text="Predict"
      />
      <DesktopLinkIcon
        to="/schedule"
        icon={faCalendar}
        menuItem={MenuItem.Schedule}
        text="Schedule"
      />
      <DesktopLinkIcon
        to="/halloffame"
        icon={faTrophy}
        menuItem={MenuItem.HallOfFame}
        text="HoF"
      />
      <button
        onClick={handleSignOutClick}
        className="absolute bottom-3 mt-4 flex flex-col items-center hover:cursor-pointer hover:text-blue-300"
      >
        <FontAwesomeIcon
          icon={faArrowRightFromBracket}
          className="text-xl p-1"
        />
        <p className="text-white font-semibold text-sm font-novaMono">Logout</p>
      </button>
    </div>
  );
};

export default Navbar;
