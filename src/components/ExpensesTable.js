import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

class ExpensesTable extends React.Component {
  createExpense(expense) {
    const { value, description, currency, method, tag, exchangeRates, id } = expense;
    let currencyValue = 1;
    const currencyObj = exchangeRates[currency];
    let onlyExchangeCashName = 'Real';
    if (currency !== 'BRL') {
      currencyValue = currencyObj.ask;
      const cashName = currencyObj.name;
      const cashNameArray = cashName.split('/');
      [onlyExchangeCashName] = cashNameArray;
    }
    const convertedValue = currencyValue * value;
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
            data-testid="delete-btn"
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
};

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
});

export default connect(mapStateToProps)(ExpensesTable);
