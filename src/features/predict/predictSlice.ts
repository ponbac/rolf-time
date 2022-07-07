import { createSlice } from "@reduxjs/toolkit";
import { updateUserPredictions } from "../../utils/dataFetcher";
import store, { AppState, AppThunk } from "../../utils/store";

const initialPredictState: {
  predictions: GroupPrediction[];
  isSaved: boolean | null;
} = {
  predictions: [],
  isSaved: null,
};

export const predictSlice = createSlice({
  name: "predict",

  initialState: initialPredictState,

  reducers: {
    predictGroup(state, action) {
      const groupId = action.payload.groupId.toUpperCase();
      const teams = action.payload.prediction;

      const groupIndex = state.predictions.findIndex(
        (group) => group.groupId === groupId
      );

      if (groupIndex == -1) {
        state.predictions.push({
          groupId: groupId,
          games: [],
          result: teams,
        });
      } else {
        let group = state.predictions[groupIndex];
        group.result = teams;

        state.predictions[groupIndex] = group;
      }
    },
    predictGame(state, action) {
      const groupId = action.payload.groupId.toUpperCase();
      const gamePrediction = action.payload.gamePrediction;

      const groupIndex = state.predictions.findIndex(
        (group) => group.groupId === groupId
      );

      if (groupIndex == -1) {
        let games = [];
        games.push(gamePrediction);

        state.predictions.push({
          groupId: groupId,
          games: games,
          result: [],
        });
      } else {
        let group = state.predictions[groupIndex];
        let games = group.games;

        const gameIndex = games.findIndex(
          (game) => game.id === gamePrediction.id
        );
        if (gameIndex == -1) {
          games.push(gamePrediction);
        } else {
          games[gameIndex] = gamePrediction;
        }

        group.games = games;
        state.predictions[groupIndex] = group;
      }
    },
    setSaved(state, action) {
      state.isSaved = action.payload;
    },
    setPredictions(state, action) {
      state.predictions = action.payload;
    },
  },

  extraReducers: {},
});

export const savePredictions = (): AppThunk => async (dispatch) => {
  const user = store.getState().auth.user;
  if (user == null) {
    return;
  }

  let predictions = store.getState().predict.predictions;
  if (predictions) {
    predictions.forEach((prediction) => {
      // TODO: Check if prediction is valid
      console.log(prediction);
    });

    updateUserPredictions(user.id, predictions);

    dispatch(setSaved(true));
  }
};

export default predictSlice.reducer;
export const { predictGroup, predictGame, setSaved, setPredictions } =
  predictSlice.actions;

export const selectPredictions = (state: AppState) => state.predict.predictions;
