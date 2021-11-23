import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import WalletForm from '../components/WalletForm';
import { populateCurrenciesAction, fetchExchangeRates } from '../actions';

class Wallet extends React.Component {
  componentDidMount() {
    this.fetchCurrencies();
  }

  async fetchCurrencies() {
    const { populateCurrencies, getExchangeRates } = this.props;
    const currenciesObj = await getExchangeRates();
    const currencies = Object.keys(currenciesObj);
    const filteredCurrencies = currencies.filter((currency) => currency !== 'USDT');
    populateCurrencies(filteredCurrencies);
  }

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
          <button type="button">Excluir</button>
        </td>
      </tr>
    );
  }

  render() {
    const { email, totalWalletValue, expenses } = this.props;
    return (
      <div>
        <header>
          <h3 data-testid="email-field">{email}</h3>
          <section>
            <p data-testid="total-field">
              {totalWalletValue}
              <span data-testid="header-currency-field">BRL</span>
            </p>
          </section>
        </header>
        <WalletForm />
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
      </div>
    );
  }
}

Wallet.defaultProps = {
  totalWalletValue: 0,
};

Wallet.propTypes = {
  email: PropTypes.string.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.any).isRequired,
  getExchangeRates: PropTypes.func.isRequired,
  populateCurrencies: PropTypes.func.isRequired,
  totalWalletValue: PropTypes.number,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
  totalWalletValue: state.wallet.totalWalletValue,
  expenses: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  populateCurrencies: (currencies) => dispatch(populateCurrenciesAction(currencies)),
  getExchangeRates: () => dispatch(fetchExchangeRates()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
