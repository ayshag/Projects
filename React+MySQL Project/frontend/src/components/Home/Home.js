import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

import {Link} from 'react-router-dom';


class Home extends Component {
    constructor(){
        super();
        this.state = {  
          
            destination : "",
            arrive : "",
            depart : "",
            guests : "",
            submit : false,
           
        }
        this.destinationChangeHandler = this.destinationChangeHandler.bind(this);
        this.arriveChangeHandler = this.arriveChangeHandler.bind(this);
        this.departChangeHandler = this.departChangeHandler.bind(this);
        this.guestsChangeHandler = this.guestsChangeHandler.bind(this);
        this.submitSearch= this.submitSearch.bind(this);
        this.submitProfile = this.submitProfile.bind(this);
        this.setFocus = this.setFocus.bind(this);   
        this.setBlur = this.setBlur.bind(this);
       
    }  
    destinationChangeHandler = (e) => {
        
        this.setState({
            destination : e.target.value
        })
       
    }
     
    arriveChangeHandler = (e) => {
        this.setState({
            arrive : e.target.value
        })
    }
    
    departChangeHandler = (e) => {
        this.setState({
            depart : e.target.value
        })
    }
    
    guestsChangeHandler = (e) => {
        this.setState({
            guests : e.target.value
        })
    }
    
    componentDidMount(){
       // sessionStorage.setItem('arrive', "");
        axios.get('http://localhost:3001/home')
                .then((response) => {
                
                console.log("DidMountHome");
                console.log(response.status);
                console.log(response.data);
            
            });
    }

    submitSearch = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
      //  this.state.submit = true
        const data = {
            destination : this.state.destination,
            arrive : this.state.arrive,
            depart : this.state.depart,
            guests : this.state.guests,
            

        }
   
        sessionStorage.setItem('destination', this.state.destination);        
        sessionStorage.setItem('arrive', this.state.arrive);
        sessionStorage.setItem('depart', this.state.depart);        
        sessionStorage.setItem('guests', this.state.guests);
        
       
        axios.post('http://localhost:3001/home',data)
            .then(response => {
             
              this.setState({
                submit : true,
               
            });
                console.log("Submit after response: " + this.state.submit);
            });
          
    }

    submitProfile = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        
       
        //make a post request with the user data
        axios.get('http://localhost:3001/search')
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Profile Get Request Data sent to Backend");
               
            });
    }
    submitSignout = (e) => {
       
            cookie.remove('cookie', { path: '/' })
        
    }

    setFocus = (e) => 
    {
        e.target.type = "date"
    }
    setBlur = (e) =>
    {
        e.target.type = "text"
    }


    render(){
    
        //if not logged in go to login page
        let redirectVar = null;
     
    let destination = "Destination"; let arrive = "Date of Arrival";let depart ="Date of Departure";let guests = "Guests";
    if(sessionStorage.getItem('destination')!='')
    {
        destination = sessionStorage.getItem('destination');
        console.log(destination);
    }
    if(sessionStorage.getItem('arrive')!='')
    {
        arrive = sessionStorage.getItem('arrive');
        console.log(arrive);
    }
    if(sessionStorage.getItem('depart')!='')
    {
        depart = sessionStorage.getItem('depart');
        console.log(depart);
    }
    if(sessionStorage.getItem('guests')!='')
    {
        guests = sessionStorage.getItem('guests');
        console.log(guests);
    }
    if(this.state.submit)
    {
        if(cookie.load('cookie'))
        {
            redirectVar = <Redirect to= "/searchresults"/>   
        }
        else 
        {
            redirectVar = <Redirect to= "/login"/>
        }
    }
        console.log("redirectvar: ",redirectVar);
        return(
            <div>
              {redirectVar}
            <div className="container">            
                <div className="main-form">
                    <div className="main-div">
                    <form onSubmit = {this.submitSearch}>
                        <div className="form-group input-group"  >
                             <input onChange = {this.destinationChangeHandler} type="text" className="form-control" name="destination" required placeholder={"Destination"}/>
                             <input onChange = {this.arriveChangeHandler} type="text" className="form-control" name="arrive" required placeholder={"Date of Arrival"} onFocus ={this.setFocus} onBlur ={this.setBlur}  />
                             <input onChange = {this.departChangeHandler} type="text" className="form-control" name="depart" required placeholder={"Date of Departure"} onFocus ={(e) => e.target.type = "date"} onBlur ={(e) => e.target.type = "text"} />
                             <input onChange = {this.guestsChangeHandler} type="text" className="form-control" name="guests" required pattern={'[0-9]{1,}'} placeholder={"Guests"}/>                         
                           


                            <button type="submit" className="btn btn-primary">Search</button> 
                         
                         </div>  
                         </form>                      
                    </div>
                </div>
            </div>
            </div>
            
               
                
        )
    }
}

export default Home;
