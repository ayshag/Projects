import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';

class OwnerSignup extends Component{
    
    constructor(props){
       
        super(props);
        
        this.state = {
            name : "",
       
            username : "",
            password : "",
            phone : "",
            authFlag : false,
            uniqueUser : ""
        }
        
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
   
      this.phoneChangeHandler=this.phoneChangeHandler.bind(this);
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
 }
 componentDidMount(){
    axios.get('http://localhost:3001/ownersignup')
    .then(response => {    });
}
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    
     nameChangeHandler = (e) => {
        this.setState({
            name : e.target.value
        })
    }
  
    usernameChangeHandler = (e) => {
        this.setState({
            username : e.target.value,
            uniqueUserAlert :""
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value,
            uniqueUserAlert : ""
        })
    }

    phoneChangeHandler = (e) => {
        this.setState({
            phone : e.target.value
        })
    }
  
    submitSignup = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            username : this.state.username,
            password : this.state.password,
            phone : this.state.phone,
            //email : this.state.email,
            name : this.state.name
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        
        axios.post('http://localhost:3001/ownersignup',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        authFlag : true
                    })
                }else{
                    this.setState({
                        authFlag : false
                    })
                }
                if(response.data == "Failed" )
                {
                    this.setState({
                        uniqueUser : "Failed"
                    })
                }
            });
    }

    render(){
        //redirect based on successful login
        let redirectVar = null;
        let uniqueUserAlert = null;
        if(cookie.load('cookie')){
            redirectVar = <Redirect to= "/postproperty"/>
        }
       
        if(this.state.uniqueUser == "Failed")
            uniqueUserAlert = <h6>Username not available. Please pick another username</h6>
        return(
            <div>
                {redirectVar}
                <div className="container">
                <div className="centralize">
                    <form onSubmit={this.submitSignup}>
                        <div className="login-form">

                            <div className="signin-signup">
                                <div className="panel">
                                    <h3>Owner Signup</h3>
                                    <p>Create Owner Account</p>
                                </div>
                                <div className="form-group">

                                    <input onChange={this.nameChangeHandler} type="text" className="form-control" required name="name" placeholder="Name" />
                                </div>
                                <div className="form-group">

                                    <input onChange={this.phoneChangeHandler} type="text" className="form-control" required pattern = {'[0-9]{10}'} name="phone" placeholder="Phone Number (10 digits required)" />
                                </div>

                                <div className="form-group">
                                    <input onChange={this.usernameChangeHandler} type="email" className="form-control" required name="username" placeholder="Username" />
                                </div>
                                <div className="form-group">
                                    <input onChange={this.passwordChangeHandler} type="password" className="form-control" required name="password" placeholder="Password" />
                                </div>

                                <div>{uniqueUserAlert}</div>
                                <button type="submit" className="btn btn-primary">Signup</button>
                            </div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
            
        )
    }
}
//export Signup Component
export default OwnerSignup;
