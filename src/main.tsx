import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import "./index.css";
import store from "./utils/store";
import Home from "./views/home";
import HallOfFame from "./views/halloffame";
import PredictGroups from "./views/predict/groups";
import GroupBlock from "./views/predict/[groupId]";
import Schedule from "./views/schedule";
import UpdateProfile from "./views/profile/update";
import UserProfile from "./views/profile/[user]";
import UserPredictions from "./views/profile/predictions";
import GameView from "./views/[game]";
import { QueryClient, QueryClientProvider } from "react-query";
import { PLAYOFF_PREDICTIONS_OPEN } from "./utils/constants";
import PredictPlayoffs from "./views/predict/playoffs";
import moment from "moment";

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Home />} />
              <Route path="profile/update" element={<UpdateProfile />} />
              <Route path="profile/:id" element={<UserProfile />} />
              <Route
                path="profile/:id/predictions"
                element={<UserPredictions />}
              />
              <Route path="/game/:id" element={<GameView />} />
              <Route
                path="predict"
                element={
                  moment().isAfter(PLAYOFF_PREDICTIONS_OPEN) ? (
                    <PredictPlayoffs />
                  ) : (
                    <PredictGroups />
                  )
                }
              />
              <Route path="predict/group/:id" element={<GroupBlock />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="halloffame" element={<HallOfFame />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
