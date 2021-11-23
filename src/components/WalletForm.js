import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import MethodSelect from './MethodSelect';
import CurrencySelect from './CurrencySelect';
import TagSelect from './TagSelect';
import { addExpenseAction, fetchExchangeRates, updateTotalAction } from '../actions';

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
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value });
  }

  async handleClick(event) {
    event.preventDefault();
    const { addExpense, getExchangeRates, expenses, updateTotal, idGlobal } = this.props;
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
      exchangedValue,
      exchangeRates,
    };

    this.setState(INITIAL_STATE);
    addExpense(expense);
  }

  render() {
    const { value, description, currency, method, tag } = this.state;
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
        <button type="submit" onClick={ this.handleClick }>Adicionar despesa</button>
      </form>
    );
  }
}

WalletForm.defaultProps = {
  idGlobal: 0,
};

WalletForm.propTypes = {
  addExpense: PropTypes.func.isRequired,
  getExchangeRates: PropTypes.func.isRequired,
  updateTotal: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.any).isRequired,
  idGlobal: PropTypes.number,
};

const mapDispatchToProps = (dispatch) => ({
  addExpense: (payload) => dispatch(addExpenseAction(payload)),
  getExchangeRates: () => dispatch(fetchExchangeRates()),
  updateTotal: (value) => dispatch(updateTotalAction(value)),
});

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
  idGlobal: state.wallet.idGlobal,
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletForm);
