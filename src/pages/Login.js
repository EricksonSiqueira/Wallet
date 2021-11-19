import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { loginAction } from '../actions';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      buttonIsEnable: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState({ [name]: value },
      () => {
        this.setState({ buttonIsEnable: this.toggleButton() });
      });
  }

  handleClick(event) {
    event.preventDefault();
    const { email } = this.state;
    const { login } = this.props;
    const { history } = this.props;
    login(email);
    history.push('/carteira');
  }

  toggleButton() {
    const { email, password } = this.state;
    const minPasswordLength = 6;
    const passwordIsValid = password.length >= minPasswordLength;
    const emailIsValid = this.validateEmail(email);

    return passwordIsValid && emailIsValid;
  }

  // Peguei esse código de https://www.horadecodar.com.br/2020/09/13/como-validar-email-com-javascript/
  validateEmail(email) {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  }

  render() {
    const { email, password, buttonIsEnable } = this.state;
    return (
      <section>
        <h1>TRYBE WALLET</h1>
        <form>
          <label htmlFor="email">
            <input
              data-testid="email-input"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={ email }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="password">
            <input
              data-testid="password-input"
              type="password"
              name="password"
              id="password"
              placeholder="Senha"
              value={ password }
              onChange={ this.handleChange }
            />
          </label>
          <button
            type="submit"
            disabled={ !buttonIsEnable }
            onClick={ this.handleClick }
          >
            Entrar
          </button>
        </form>
      </section>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  login: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  login: (email) => dispatch(loginAction(email)),
});

export default connect(null, mapDispatchToProps)(Login);
