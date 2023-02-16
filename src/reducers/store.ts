import { configureStore, createSlice } from '@reduxjs/toolkit';

const todoData = createSlice({
  name: 'data',
  initialState: [],
  reducers: {
    funcName: (state, action) => {},
  },
});

export const { funcName } = todoData.actions;

export const store = configureStore({
  reducer: {
    todoData: todoData.reducer,
  },
});
