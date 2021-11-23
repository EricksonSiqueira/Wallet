import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import WalletForm from '../components/WalletForm';
import { populateCurrenciesAction, fetchExchangeRates } from '../actions';
import ExpensesTable from '../components/ExpensesTable';

class Wallet extends React.Component {
  constructor() {
    super();
    this.state = {
      totalWalletValue: 0.00,
    };
    this.getTotalValue = this.getTotalValue.bind(this);
    this.updateTotalValue = this.updateTotalValue.bind(this);
  }

  componentDidMount() {
    this.fetchCurrencies();
    this.getTotalValue();
  }

  getTotalValue() {
    const { expenses } = this.props;
    let totalValue = 0.00;
    if (expenses.length > 0) {
      expenses.forEach((expense) => {
        const { currency, value, exchangeRates } = expense;

        const currencyObj = exchangeRates[currency];
        const currencyValue = currencyObj.ask;
        const exchangedValue = Number((currencyValue * value).toFixed(2));
        totalValue += exchangedValue;
      });
    }

    totalValue = totalValue.toFixed(2);
    this.setState({ totalWalletValue: totalValue });
  }

  updateTotalValue(value) {
    const { totalWalletValue } = this.state;
    const newTotalValue = Number(totalWalletValue) + value;
    this.setState({ totalWalletValue: newTotalValue.toFixed(2) });
  }

  async fetchCurrencies() {
    const { populateCurrencies, getExchangeRates } = this.props;
    const currenciesObj = await getExchangeRates();
    const currencies = Object.keys(currenciesObj);
    const filteredCurrencies = currencies.filter((currency) => currency !== 'USDT');
    populateCurrencies(filteredCurrencies);
  }

  render() {
    const { totalWalletValue } = this.state;
    const { email } = this.props;
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
        <WalletForm updateTotalValue={ this.updateTotalValue } />
        <ExpensesTable updateTotalValue={ this.updateTotalValue } />
      </div>
    );
  }
}

Wallet.propTypes = {
  email: PropTypes.string.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.any).isRequired,
  getExchangeRates: PropTypes.func.isRequired,
  populateCurrencies: PropTypes.func.isRequired,
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
