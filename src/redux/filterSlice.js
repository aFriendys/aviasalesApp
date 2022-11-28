/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: { radioGroup: 'cheap', checkboxGroup: ['2 Пересадки'] },
  reducers: {
    toggleFilter(state, action) {
      if (action.payload) {
        if (state.checkboxGroup.includes(action.payload)) {
          state.checkboxGroup = state.checkboxGroup.filter((elem) => elem !== action.payload);
        } else {
          state.checkboxGroup.push(action.payload);
        }
      }
    },
    toggleAll(state) {
      state.checkboxGroup =
        state.checkboxGroup.length < 4 ? ['Без пересадок', '1 Пересадка', '2 Пересадки', '3 Пересадки'] : [];
    },
    toggleRadio(state, action) {
      state.radioGroup = action.payload;
    },
  },
});

export default filtersSlice.reducer;
export const { toggleFilter, toggleAll, toggleRadio } = filtersSlice.actions;
