import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../actions";
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';



class Login extends Component {

    //Define component that you wanbt to render
    renderField(field) {
        const { meta: { touched, error } } = field;
        const className = `form-group ${touched && error ? "has-danger" : ""}`;
        

        return (
            <div className={className}>
                <label>{field.label}</label>
                <input className="form-control" type={field.type} {...field.input} />
                <div className="text-help">
                    {touched ? error : ""}
                </div>
            </div>
        );
    }
 
  
    onSubmit(values) {
        var headers = new Headers();

        //prevent page from refresh
        //e.preventDefault();
        console.log("values" ,values);
         this.props.login(values,() => {this.props.history.push("/home");});
      
        //set the with credentials to true
       axios.defaults.withCredentials = true;
    }

    render() {
        const { handleSubmit } = this.props;
        let redirectVar = null;
        let notvalidatedalert = null;
        if (cookie.load('cookie')) {
            console.log("Redirecting to Home");
            redirectVar = <Redirect to="/home" />
        }
     //   if (this.state.validated === "Failed")
     //       notvalidatedalert = <h6>Incorrect username or password entered. Please try again</h6>

        return (

            <div className="container">
                {redirectVar}
                <div className="login-form">
                    <div className="signin-signup">
                        {notvalidatedalert}
                        <div className="panel">
                            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                                <h3>Signin To HomeAway</h3>
                                <h6>Don't have an account?  <Link to="/signup" >Traveler Signup</Link>  </h6>
                                <Field
                                    label="Username"
                                    name="username"
                                    type="text"
                                    component={this.renderField}
                                />
                                <Field
                                    label="Password"
                                    name="password"
                                    type = "password"
                                    component={this.renderField}
                                />


                                <div>{notvalidatedalert}</div>
                                <button type="submit" className="btn btn-primary">Login</button>
                            </form>

                        </div>

                    </div>
                </div>
            </div>

        );
    }
}

function validate(values) {

    const errors = {};

    // Validate the inputs from 'values'
    if (!values.username) {
        errors.username = "Enter Username";
    }
    if (!values.password) {
        errors.password = "Enter Password";
    }

    return errors;
}

export default reduxForm({
    validate,
    form: "LoginForm"
})(connect(null, { login })(Login));
