import { createSlice } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import { ADMIN_ID } from "../../utils/constants";
import { fetchUser, updateUserData } from "../../utils/dataFetcher";
import { AppState, AppThunk } from "../../utils/store";

const initialAuthState: { isAuthenticated: boolean; user: PlayerUser | null } =
  {
    isAuthenticated: false,
    user: null,
  };

export const authSlice = createSlice({
  name: "auth",

  initialState: initialAuthState,

  reducers: {
    signedIn(state, action) {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    },
    signedOut(state) {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    },
  },

  extraReducers: {},
});

export const login =
  (user: User): AppThunk =>
  async (dispatch) => {
    const playerUser = fetchUser(user.id).then((playerUser) => {
      if (playerUser.name == null) {
        updateUserData(
          user.id,
          user.user_metadata.full_name,
          user.user_metadata.avatar_url,
          "No cool description yet!"
        );

        playerUser.name = user.user_metadata.full_name;
        playerUser.avatar = user.user_metadata.avatar_url;
        playerUser.description = "No cool description yet!";
      }

      dispatch(signedIn(playerUser));
    });
  };

export default authSlice.reducer;
export const { signedIn, signedOut } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth;
export const selectUser = (state: AppState) => selectAuthState(state).user;
export const selectIsAdmin = (state: AppState) =>
  selectAuthState(state).user?.id == ADMIN_ID;
