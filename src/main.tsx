import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import "./index.css";
import store from "./utils/store";
import Home from "./views";
import HallOfFame from "./views/halloffame";
import Predict from "./views/predict/groups";
import GroupBlock from "./views/predict/[groupId]";
import Schedule from "./views/schedule";
import UpdateProfile from "./views/profile/update";
import UserProfile from "./views/profile/[user]";
import UserPredictions from "./views/profile/predictions";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="profile/update" element={<UpdateProfile />} />
            <Route path="profile/:id" element={<UserProfile />} />
            <Route path="profile/:id/predictions" element={<UserPredictions />} />
            <Route path="predict" element={<Predict />} />
            <Route path="predict/group/:id" element={<GroupBlock />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="halloffame" element={<HallOfFame />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
