import { FC } from "react";

const Header: FC<{ text: string }> = ({ text }) => {
  return (
    <div className="pt-7 text-center flex flex-row items-center justify-center top-0">
      <h1 className="font-novaMono font-extrabold text-transparent text-7xl md:text-8xl bg-clip-text bg-gradient-to-b from-primary to-[#4D77FF]" style={{}}>
        {text}
      </h1>
    </div>
  );
};

export default Header;
