import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import WalletForm from '../components/WalletForm';
import { populateCurrenciesAction, fetchExchangeRates } from '../actions';
import ExpensesTable from '../components/ExpensesTable';

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
    const { email, totalWalletValue } = this.props;
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
        <ExpensesTable />
      </div>
    );
  }
}

Wallet.defaultProps = {
  totalWalletValue: 0,
};

Wallet.propTypes = {
  email: PropTypes.string.isRequired,
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
