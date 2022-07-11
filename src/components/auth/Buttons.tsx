import { useDispatch } from "react-redux";
import { login, signedOut } from "../../features/auth/authSlice";
import { SUPABASE, updateUserData } from "../../utils/dataFetcher";
import { useAppDispatch } from "../../utils/store";

export enum SignInProvider {
  Facebook = "facebook",
  Discord = "discord",
}
const SignInButton: React.FC<{ provider: SignInProvider; text: string }> = ({
  provider,
  text,
}) => {
  const dispatch = useAppDispatch();

  async function signInWithDiscord() {
    const { user, session, error } = await SUPABASE.auth.signIn(
      {
        provider: provider,
      },
      {
        redirectTo: window.location.origin,
      }
    );

    console.log(user);
    console.log(session);
    console.log(error);

    if (user) {
      console.log(user);
      dispatch(login(user));
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    signInWithDiscord();
  };

  const backgroundStyle =
    provider == SignInProvider.Discord
      ? "bg-gradient-to-r from-[#6A5ACD] to-[#4B0082]"
      : "bg-gradient-to-r from-[#4267B2] to-[#898F9C]";
  return (
    <button onClick={handleClick}>
      <div
        className={
          "hover:cursor-pointer text-center  text-white transition-all w-32 hover:w-36 hover:text-gray-400 p-2 rounded-xl font-bold" +
          ` ${backgroundStyle}`
        }
      >
        {text}
      </div>
    </button>
  );
};

const SignOutButton: React.FC<{}> = ({}) => {
  const dispatch = useDispatch();

  async function signOut() {
    const { error } = await SUPABASE.auth.signOut();

    dispatch(signedOut());
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    signOut();
  };

  return <button onClick={handleClick}>Sign Out!</button>;
};

const SessionInfoButton: React.FC<{}> = ({}) => {
  async function updateMetadata() {
    const user = SUPABASE.auth.user();
    const userId = user?.id;
    if (userId) {
      updateUserData(
        userId,
        "Pontusu",
        user.user_metadata.avatar_url,
        "Hackerutojvi"
      );
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    updateMetadata();
    console.log(SUPABASE.auth.user());
  };

  return <button onClick={handleClick}>Session Info!</button>;
};

export { SignInButton, SignOutButton, SessionInfoButton };
