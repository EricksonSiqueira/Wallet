import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

class CurrencySelect extends React.Component {
  createOption(currency) {
    return (
      <option key={ currency } value={ currency }>{ currency }</option>
    );
  }

  render() {
    const { handleChange, currency, currencies } = this.props;
    return (
      <label htmlFor="currency">
        Moeda
        <select
          name="currency"
          id="currency"
          data-testid="currency-input"
          value={ currency }
          onChange={ handleChange }
        >
          {currencies.map((curr) => this.createOption(curr)) }
        </select>
      </label>
    );
  }
}

const mapStateToProps = (state) => ({
  currencies: state.wallet.currencies,
});

CurrencySelect.propTypes = {
  handleChange: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(mapStateToProps)(CurrencySelect);
