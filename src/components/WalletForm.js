import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import MethodSelect from './MethodSelect';
import CurrencySelect from './CurrencySelect';
import TagSelect from './TagSelect';
import { addExpenseAction, fetchExchangeRates,
  updateTotalAction, removeExpenseAction, editExpenseAction } from '../actions';

const INITIAL_STATE = {
  value: 0,
  description: '',
  currency: 'USD',
  method: 'Cartão de crédito',
  tag: 'Alimentação',
};
class WalletForm extends React.Component {
  constructor() {
    super();
    this.state = INITIAL_STATE;
    this.handleChange = this.handleChange.bind(this);
    this.addExpense = this.addExpense.bind(this);
    this.editExpense = this.editExpense.bind(this);
    this.addEditExpensesToStore = this.addEditExpensesToStore.bind(this);
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  async addEditExpensesToStore(expense, index) {
    const { expenses, updateExpenses, changeEditMode } = this.props;
    expenses[index] = expense;
    updateExpenses(expenses);
    changeEditMode({ bool: false, id: 0 });
    this.setState(INITIAL_STATE);
  }

  async editExpense(event) {
    event.preventDefault();
    const { id, expenses, updateTotalValue } = this.props;
    const { currency, value: newValue } = this.state;
    let indexTochange = 0;
    expenses.forEach((expense, index) => {
      if (expense.id === id) indexTochange = index;
    });
    const { exchangeRates, value: oldValue } = expenses[indexTochange];
    let currencyValue = 1;
    if (currency !== 'BRL') {
      const currencyObj = exchangeRates[currency];
      currencyValue = currencyObj.ask;
    }
    const oldExchangedValue = Number((currencyValue * oldValue).toFixed(2));

    const expense = {
      ...expenses[indexTochange],
      ...this.state,
    };
    await this.addEditExpensesToStore(expense, indexTochange);
    const newExchangedValue = Number((currencyValue * newValue).toFixed(2));
    await updateTotalValue(newExchangedValue - oldExchangedValue);
  }

  async addExpense(event) {
    event.preventDefault();
    const { addExpense, getExchangeRates,
      expenses, updateTotal, idGlobal, updateTotalValue } = this.props;
    const { currency, value } = this.state;
    const exchangeRates = await getExchangeRates(expenses);

    let currencyValue = 1;
    if (currency !== 'BRL') {
      const currencyObj = exchangeRates[currency];
      currencyValue = currencyObj.ask;
    }
    const exchangedValue = Number((currencyValue * value).toFixed(2));
    updateTotal(exchangedValue);

    const expense = {
      id: idGlobal,
      ...this.state,
      exchangeRates,
    };

    this.setState(INITIAL_STATE);
    addExpense(expense);
    updateTotalValue(exchangedValue);
  }

  render() {
    const { value, description, currency, method, tag } = this.state;
    const { editor } = this.props;
    return (
      <form>
        <label htmlFor="value">
          Valor
          <input
            data-testid="value-input"
            type="number"
            id="value"
            name="value"
            value={ value }
            onChange={ this.handleChange }
          />
        </label>
        <label htmlFor="description">
          Descrição
          <input
            data-testid="description-input"
            type="text"
            id="description"
            name="description"
            value={ description }
            onChange={ this.handleChange }
          />
        </label>
        <MethodSelect handleChange={ this.handleChange } method={ method } />
        <CurrencySelect handleChange={ this.handleChange } currency={ currency } />
        <TagSelect handleChange={ this.handleChange } tag={ tag } />
        {editor
          ? <button type="submit" onClick={ this.editExpense }>Editar despesa</button>
          : <button type="submit" onClick={ this.addExpense }>Adicionar despesa</button>}
      </form>
    );
  }
}

WalletForm.defaultProps = {
  idGlobal: 0,
  id: 0,
  editor: false,
};

WalletForm.propTypes = {
  addExpense: PropTypes.func.isRequired,
  getExchangeRates: PropTypes.func.isRequired,
  updateTotal: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.any).isRequired,
  idGlobal: PropTypes.number,
  updateTotalValue: PropTypes.func.isRequired,
  editor: PropTypes.bool,
  id: PropTypes.number,
  updateExpenses: PropTypes.func.isRequired,
  changeEditMode: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  addExpense: (payload) => dispatch(addExpenseAction(payload)),
  getExchangeRates: () => dispatch(fetchExchangeRates()),
  updateTotal: (value) => dispatch(updateTotalAction(value)),
  updateExpenses: (newExpenses) => dispatch(removeExpenseAction(newExpenses)),
  changeEditMode: (bool) => dispatch(editExpenseAction(bool)),
});

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
  idGlobal: state.wallet.idGlobal,
  editor: state.wallet.editor,
  id: state.wallet.idToEdit,
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
