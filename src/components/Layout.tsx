import { motion } from "framer-motion";
import { FC, ReactNode, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Navbar from "./Navbar";
import { fetchUser, SUPABASE } from "../utils/dataFetcher";
import { SignInButton, SignInProvider } from "./auth/Buttons";
import { useSelector } from "react-redux";
import {
  login,
  selectAuthState,
  selectUser,
  signedIn,
  signedOut,
} from "../features/auth/authSlice";
import { useAppDispatch } from "../utils/store";
import { setPredictions } from "../features/predict/predictSlice";
import LoginView from "../views/login";

const Head: FC<{ user?: PlayerUser }> = ({ user }) => {
  return (
    <Helmet>
      <title>
        {user ? `[${user.name} - ${user.score}p]` : "Backman - [England 2022]"}
      </title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Nova+Mono&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );
};

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const user = useSelector(selectUser);
  const authState = useSelector(selectAuthState);
  const dispatch = useAppDispatch();

  const authIdToPlayerUser = async (authId: string) => {
    const playerUser = await fetchUser(authId);
    return playerUser;
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const session = SUPABASE.auth.session();

    if (session?.user) {
      dispatch(login(session.user));
    }

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = SUPABASE.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          dispatch(login(session.user));
        } else {
          dispatch(signedOut());
        }
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  // TODO: Can this be removed?
  useEffect(() => {
    if (authState.isAuthenticated) {
      if (user) {
        if (user.predictions && user.predictions.length > 0) {
          dispatch(setPredictions(user.predictions));
        }
      }
    } else {
      const user = SUPABASE.auth.user();
      if (user) {
        authIdToPlayerUser(user.id).then((playerUser) => {
          dispatch(signedIn(playerUser));
        });
      }
    }
  }, [authState]);

  if (window.location.pathname === "/login" && !authState.isAuthenticated) {
    return (
      <>
        <LoginView />
      </>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <>
        <Head />
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="flex flex-col space-y-3 w-80 items-center font-novaMono bg-gray-600/70 backdrop-blur-sm rounded-xl p-10">
            <h1 className="font-novaMono font-bold text-3xl mb-2">
              Sign in with
            </h1>
            <SignInButton provider={SignInProvider.Facebook} text="Facebook" />
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <Head user={authState.user ?? undefined} />
      <div className="min-h-screen flex flex-col">
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex flex-col lg:flex-row"
        >
          <div className="fixed min-w-full lg:min-w-fit z-10">
            <Navbar />
          </div>
          <div className="flex flex-col flex-1 lg:ml-24 pt-16 lg:pt-0 ">
            <main>{children}</main>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Layout;
