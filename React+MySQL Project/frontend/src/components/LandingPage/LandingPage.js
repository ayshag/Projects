import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';


class LandingPage extends Component {
    constructor() {
        super();
        this.state = {
            owner: false
        }
        this.submitSignout = this.submitSignout.bind(this);
       // this.getuseraccess = this.getuseraccess.bind(this);
    }

  
    submitSignout = (e) => {

        cookie.remove('cookie', { path: '/' });
        sessionStorage.setItem('destination', "");
        sessionStorage.setItem('arrive', "");
        sessionStorage.setItem('depart', "");
        sessionStorage.setItem('guests', "");

    }
    render() {
        let navLogin = null;
        let homeaway = null;
        console.log("Rendering Landing Page");
     
        if (cookie.load('cookie')) {
            console.log("Able to read cookie");
          let ownerdash = null;
           let propertypost = null;
          
                 ownerdash =  <div> <Link to="/ownerdashboard">Owner Dashboard</Link> | </div>
                 propertypost = <div> <Link to="/postproperty">Post a Property Now</Link> | </div>
     

            navLogin = (

                <ul className="nav navbar-nav">
                    <li className="nav-item">
                        <Link to="/dashboard">Dashboard</Link> |
                    </li>
                    <li className="nav-item">
                        <Link to="/profile">Profile</Link> |
                    </li>
                    <li className="nav-item">
                        {ownerdash}
                    </li>
                    <li className="nav-item">
                        {propertypost}
                    </li>
                    <li className="nav-item">
                        <Link to="/login" onClick={this.submitSignout}>Signout</Link>
                    </li>
                </ul>

            );

        } else {
            //Else display login button
            console.log("Not Able to read cookie");
            navLogin = (
                <ul className="nav navbar-nav">
                 <li className="nav-item">
                 
                     <Link to="/login">Traveler Login</Link> |
                </li>
                <li className="nav-item">
                    <Link to="/ownerlogin">Owner Login</Link>
                    </li>
                </ul>
            );


        }

        homeaway = (<Link to="/home"><h1> HomeAway</h1> </Link>);
        let redirectVar = <Redirect to="/home" />

        return (
            <div>
            
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                
                    <div className="container-fluid">
                        <div className="navbar-header">
                            {homeaway}
                        </div>
                        {navLogin}
                    </div>

   
                </nav>
                {redirectVar}
            </div>
            </div>
        )
    }
}

export default LandingPage;
