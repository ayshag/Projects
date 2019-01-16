import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';

//Define a Login Component
class Login extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            username : "",
            password : "",
            authFlag : false,
            validated : ""
        }
  
        
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        
    }

    componentWillMount(){
        this.setState({
            authFlag : false
        })
        
      
    }
   
    usernameChangeHandler = (e) => {
        this.setState({
            username : e.target.value,
            validated : ""
        })
      
    }
    
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value,
            validated : ""
        })
    }
   
    submitLogin = (e) => {
        var headers = new Headers();
        
        //prevent page from refresh
        e.preventDefault();
        const data = {
            username : this.state.username,
            password : this.state.password
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
       
      
        //make a post request with the user data
        axios.post('http://localhost:3001/login',data)
            .then(response =>  {
               console.log(cookie.load('cookie'));
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    sessionStorage.setItem('CurrentUser',this.state.username);
                   this.setState({
                        authFlag : true, 
                    });
                }else{
                    this.setState({
                        authFlag : false
                    })
                }

                if(response.data === "Failed")
                {
                    this.setState({
                        validated : "Failed"
                    })
                }

            });
    }

    render(){
        //redirect based on successful login
        let redirectVar = null;
        let notvalidatedalert = null;
        console.log(cookie.load('cookie'));
      if(cookie.load('cookie')){
        console.log("Redirecting to Home");
            redirectVar = <Redirect to= "/home"/>
        }
        if(this.state.validated === "Failed")
            notvalidatedalert = <h6>Incorrect username or password entered. Please try again</h6>
      
        return(
            <div>
               {redirectVar}
             
            <div className="container">
                
                <div className="login-form">
                    <div className="signin-signup">
                        <div className="panel">
                            <form onSubmit = {this.submitLogin}>
                            <h3>Signin To HomeAway</h3>
                            <h6>Don't have an account?  <Link to="/signup" >Traveler Signup</Link>  </h6>
                        
                            <div className="form-group">
                                <input onChange = {this.usernameChangeHandler} type="email" class="form-control" required name="username" placeholder="Username"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" required name="password" placeholder="Password"/>
                            </div>
                            <div>{notvalidatedalert}</div>
                            <button type="submit" className="btn btn-primary">Login</button>                 
                            </form>
                   
                    </div>
                    
                </div>
            </div>
            </div>
            </div>
        )
    }
}

export default Login;
