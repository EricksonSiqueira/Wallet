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
      totalWalletValue: 0,
    };
    this.updateTotaWalletlValue = this.updateTotaWalletlValue.bind(this);
  }

  componentDidMount() {
    this.fetchCurrencies();
    this.updateTotaWalletlValue();
  }

  updateTotaWalletlValue() {
    const { expenses } = this.props;
    let totalValue = 0.00;
    console.log(expenses);
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
        <WalletForm updateTotaWalletlValue={ this.updateTotaWalletlValue } />
        <ExpensesTable updateTotaWalletlValue={ this.updateTotaWalletlValue } />
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
