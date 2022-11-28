/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getTickets = async (searchId) => {
  const ticketsResult = [];
  try {
    const ticketsResponse = await fetch(`https://aviasales-test-api.kata.academy/tickets?searchId=${searchId}`);
    const { tickets, stop } = await ticketsResponse.json();
    ticketsResult.push(...tickets);
    if (!stop) {
      ticketsResult.push(...(await getTickets(searchId)));
    }
  } catch (e) {
    if (e.name === 'SyntaxError') {
      ticketsResult.push(...(await getTickets(searchId)));
    }
  }
  return ticketsResult;
};

export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
  const searchIdResponse = await fetch('https://aviasales-test-api.kata.academy/search');
  const { searchId } = await searchIdResponse.json();
  return getTickets(searchId);
});

export const filterTickets = createAsyncThunk('tickets/filterTickets', async (_, { getState }) => {
  const { radioGroup, checkboxGroup } = getState().filters;
  const { tickets } = getState().tickets;
  let newTickets = [];
  checkboxGroup.forEach((filter) => {
    switch (filter) {
      case 'Без пересадок': {
        newTickets.push(...tickets.filter((elem) => elem.segments[0].stops.length === 0));
        break;
      }
      case '1 Пересадка': {
        newTickets.push(...tickets.filter((elem) => elem.segments[0].stops.length === 1));
        break;
      }
      case '2 Пересадки': {
        newTickets.push(...tickets.filter((elem) => elem.segments[0].stops.length === 2));
        break;
      }
      case '3 Пересадки': {
        newTickets.push(...tickets.filter((elem) => elem.segments[0].stops.length === 3));
        break;
      }
      default: {
        break;
      }
    }
  });
  if (radioGroup === 'cheap') {
    newTickets = [...newTickets].sort((a, b) => a.price - b.price);
  } else {
    newTickets = [...newTickets].sort((a, b) => a.segments[0].duration - b.segments[0].duration);
  }
  return newTickets;
});

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState: { tickets: [], filteredTickets: [], ticketsToDisplay: [], loading: false, ticketsCount: 5 },
  reducers: {
    addTicketsCount(state) {
      state.ticketsCount =
        state.filteredTickets.length > state.ticketsCount - 1 ? state.ticketsCount + 5 : state.filteredTickets.length;
      state.ticketsToDisplay = state.filteredTickets.slice(0, state.ticketsCount);
    },
  },
  extraReducers: {
    [filterTickets.pending]: (state) => {
      state.loading = true;
    },
    [filterTickets.fulfilled]: (state, action) => {
      state.ticketsCount = 5;
      state.filteredTickets = action.payload;
      state.ticketsToDisplay = action.payload.slice(0, state.ticketsCount);
      state.loading = false;
    },
    [fetchTickets.pending]: (state) => {
      state.loading = true;
    },
    [fetchTickets.fulfilled]: (state, action) => {
      state.tickets = action.payload;
      state.loading = false;
      state.filteredTickets = state.tickets
        .filter((elem) => elem.segments[0].stops.length === 2)
        .sort((a, b) => a.price - b.price);
      state.ticketsToDisplay = state.filteredTickets.slice(0, state.ticketsCount);
    },
  },
});
export const { addTicketsCount } = ticketsSlice.actions;
export default ticketsSlice.reducer;
