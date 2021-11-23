import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { removeExpenseAction, updateTotalAction } from '../actions';

class ExpensesTable extends React.Component {
  constructor() {
    super();
    this.removeExpense = this.removeExpense.bind(this);
  }

  getExchangedValue(id, expenses) {
    const expenseObj = expenses.find((expense) => expense.id === id);
    const { currency, value, exchangeRates } = expenseObj;
    let currencyValue = 1;
    const currencyObj = exchangeRates[currency];
    if (currency !== 'BRL') {
      currencyValue = currencyObj.ask;
    }
    const convertedValue = Number((currencyValue * value).toFixed(2));

    return convertedValue;
  }

  removeExpense({ target }) {
    const elementId = Number(target.id);
    const { expenses, updateExpenses, updateTotalValue } = this.props;
    const updatedExpenses = expenses.filter((expense) => expense.id !== elementId);
    const negativeValueToRemove = -(this.getExchangedValue(elementId, expenses));

    updateTotalValue(negativeValueToRemove);
    updateExpenses(updatedExpenses);
  }

  createExpense(expense) {
    const { value, description, currency, method,
      tag, exchangeRates, id } = expense;
    let currencyValue = 1;
    const currencyObj = exchangeRates[currency];
    let onlyExchangeCashName = 'Real';
    if (currency !== 'BRL') {
      currencyValue = currencyObj.ask;
      const cashName = currencyObj.name;
      const cashNameArray = cashName.split('/');
      [onlyExchangeCashName] = cashNameArray;
    }
    const convertedValue = Number((currencyValue * value).toFixed(2));
    return (
      <tr key={ id }>
        <td>{description}</td>
        <td>{tag}</td>
        <td>{method}</td>
        <td>{Number(value)}</td>
        <td>{onlyExchangeCashName}</td>
        <td>{Number(currencyValue).toFixed(2)}</td>
        <td>{Number(convertedValue).toFixed(2)}</td>
        <td>Real</td>
        <td>
          <button type="button">Editar</button>
          <button
            type="button"
            id={ id }
            data-testid="delete-btn"
            onClick={ this.removeExpense }
          >
            Excluir
          </button>
        </td>
      </tr>
    );
  }

  render() {
    const { expenses } = this.props;
    return (
      <table>
        <tbody>
          <tr>
            <th>Descrição</th>
            <th>Tag</th>
            <th>Método de pagamento</th>
            <th>Valor</th>
            <th>Moeda</th>
            <th>Câmbio utilizado</th>
            <th>Valor convertido</th>
            <th>Moeda de conversão</th>
            <th>Editar/Excluir</th>
          </tr>
          {expenses.map((expense) => this.createExpense(expense))}
        </tbody>
      </table>
    );
  }
}

ExpensesTable.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.any).isRequired,
  updateExpenses: PropTypes.func.isRequired,
  updateTotalValue: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  updateExpenses: (newExpenses) => dispatch(removeExpenseAction(newExpenses)),
  updateTotalValue: (value) => dispatch(updateTotalAction(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesTable);
