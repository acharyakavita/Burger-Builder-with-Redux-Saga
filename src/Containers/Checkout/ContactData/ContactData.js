import React, { Component } from 'react';
import Button from '../../../Components/UI/Button/Button';
import Classes from './ContactData.css';
import Spinner from '../../../Components/UI/Spinner/Spinner';
import Input from '../../../Components/UI/Input/Input';
import {connect} from 'react-redux';
import axios from '../../../axios-orders'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import {updateObject,checkValidity} from '../../../shared/utility';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation:{
                    required:true,
                    minLength:5,
                    maxLength:5
                },
                valid:false,
                touched:false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email-ID'
                },
                value: '',
                validation:{
                    required:true,
                },
                valid:false,
                touched:false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [{ value: 'fastest', displayValue: 'Fastest' }, { value: 'cheapest', displayValue: 'Cheapest' }]
                },
                value: 'fastest',
                validation:{
                    required:false,
                },
                valid:true
            },
        },
        formIsValid:false
    }

    inputChangedHandler=(event,inputIdentifier)=>{
        
        const updatedFormElement=updateObject(this.state.orderForm[inputIdentifier],{
            value: event.target.value,
            valid:checkValidity(event.target.value,this.state.orderForm[inputIdentifier].validation),
            touched:true
        })

        const updatedOrderForm=updateObject(this.state.orderForm,{[inputIdentifier]:updatedFormElement})

        let formIsValid=true;
        for(let inputID in updatedOrderForm)
        {
            formIsValid=updatedOrderForm[inputID].valid && formIsValid
        }
        this.setState({orderForm:updatedOrderForm,formIsValid:formIsValid})

    }

    orderHandler = (event) => {
        event.preventDefault();
        const formData={}
        for (let elementId in this.state.orderForm){
            formData[elementId]=this.state.orderForm[elementId].value
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.totPrice,
            order:formData,
            userId:this.props.userId
        }
        this.props.onOrderBurger(order,this.props.token)
    }

    render() {
        let formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(element => {
                    return (<Input elementType={element.config.elementType}
                        key={element.id}
                        elementConfig={element.config.elementConfig}
                        value={element.config.value} 
                        invalid={!element.config.valid}
                        shouldValidate={element.config.validation}
                        touched={element.config.touched}
                        changed={(event)=>this.inputChangedHandler(event,element.id)}/>)
                })}
                <Button disabled={!this.state.formIsValid}btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>
        )
        if (this.props.loading) {
            form = <Spinner />
        }
        return (
            <div className={Classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        )

    }
}

const mapStateToProps=state=>{
    return{
        ings:state.burgerBuilder.ingredients,
        totPrice:state.burgerBuilder.totalPrice,
        loading:state.order.loading,
        token:state.auth.token,
        userId:state.auth.userId
    }
}

const mapDispatchToProps=dispatch=>{
   return{
    onOrderBurger:(orderData,token)=>dispatch(actions.purchaseBurger(orderData,token))
   } 
}


export default connect(mapStateToProps,mapDispatchToProps) (withErrorHandler(ContactData,axios));