// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas
import { ADD_EXPENSE, UPDATE_TOTAL,
  POPULATE_CURRENCIES, REMOVE_EXPENSE } from '../actions';

const INITIAL_STATE = {
  totalWalletValue: 0,
  idGlobal: 0,
  currencies: [],
  expenses: [],
};

const walletReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case ADD_EXPENSE:
    return {
      ...state,
      idGlobal: state.idGlobal + 1,
      expenses: [...state.expenses, action.payload],
    };
  case REMOVE_EXPENSE:
    return {
      ...state,
      expenses: [...action.payload],
    };
  case UPDATE_TOTAL:
    return {
      ...state,
      totalWalletValue: Number(
        (state.totalWalletValue + action.exchangedValue).toFixed(2),
      ),
    };
  case POPULATE_CURRENCIES:
    return {
      ...state,
      currencies: action.currencies,
    };
  default:
    return state;
  }
};

export default walletReducer;
