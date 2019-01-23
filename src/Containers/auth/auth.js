import React, { Component } from 'react';
import Input from '../../Components/UI/Input/Input';
import Button from '../../Components/UI/Button/Button';
import Classes from './auth.css';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import Spinner from '../../Components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';
import {updateObject,checkValidity} from '../../shared/utility';

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email ID'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            }
        }, isSignUp: true
    }

    componentDidMount(){
        if(!this.props.buildingBuilder && this.props.authRedirect!=='/')
        {
            this.props.onSetAuthRedirect();
        }
    }

    switchAuthModeHandler = (event) => {
        this.setState(prevState => {
            return {
                isSignUp: !prevState.isSignUp
            }
        })
    }
    inputChangedHandler = (event, controlName) => {
        const updatedControls =updateObject(this.state.controls,
            {
                [controlName]: updateObject(this.state.controls[controlName],
                    {
                    value: event.target.value,
                    valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                    touched: true
                }
                )

            })
        this.setState({ controls: updatedControls })
    }

    submitHandler = (event) => {
        event.preventDefault();
        console.log(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp)
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
    }

    render() {

        let formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }
        let form = formElementsArray.map(element => {
            return (<Input key={element.id}
                elementType={element.config.elementType}
                elementConfig={element.config.elementConfig}
                value={element.config.value}
                invalid={!element.config.valid}
                shouldValidate={element.config.validation}
                touched={element.config.touched}
                changed={(event) => this.inputChangedHandler(event, element.id)} />)
        })
        if (this.props.loading) {
            form = <Spinner />
        }

        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error}</p>
            )
        }
        let authRedirect = null;
        if (this.props.isAuth) {
            authRedirect = <Redirect to={this.props.authRedirect} />
        }

        return (
            <div className={Classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
                    {this.state.isSignUp ? 'ALREADY A USER? SIGNIN' : 'NEW USER? SIGNUP'}</Button>
            </div>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password,isSignUp) => dispatch(actions.auth(email, password,isSignUp)),
        onSetAuthRedirect:()=>dispatch(actions.setAuthRedirect('/'))
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuth: state.auth.token !== null,
        buildingBuilder:state.burgerBuilder.building,
        authRedirect:state.auth.authRedirectPath
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);