import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';


class OwnerLogin extends Component{
   
    constructor(props){       
        super(props);
       
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
        
        axios.defaults.withCredentials = true;
       
      
        axios.post('http://localhost:3001/ownerlogin',data)
            .then(response =>  {
               
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    
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
      
        let redirectVar = null;
        let notvalidatedalert = null;
      if(cookie.load('cookie')){
        console.log("Redirecting to PostProperty");
            redirectVar = <Redirect to= "/postproperty"/>
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
                     
                            <h3>Signin to HomeAway as Owner</h3>                            
                            <h6>Don't have an account?  <Link to="/ownersignup" >Owner Signup</Link>  </h6>
                        
                            <form onSubmit = {this.submitLogin}>
                            <div className="form-group">
                                <input onChange = {this.usernameChangeHandler} type="email" className="form-control" required name="username" placeholder="Username"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" className="form-control" required name="password" placeholder="Password"/>
                            </div>
                            <div>{notvalidatedalert}</div>
                            <button type = "submit"  className="btn btn-primary">Login</button>  
                            </form>               
                    
                   
                    </div>
                    
                </div>
            </div>
            </div>
            </div>
        )
    }
}
//export Signin Component
export default OwnerLogin;
