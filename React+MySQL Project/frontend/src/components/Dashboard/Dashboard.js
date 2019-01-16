import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';

class Dashboard extends Component{
   
    constructor(props){
        
        super(props);
        this.state = {
            trips :[]  , 
            count : 0,
      
            selectedGetNext : "",  
            rerendered : false        
        
        }
        this.getNext = this.getNext.bind(this);
       
    }
   
    componentDidMount(){
      
        axios.get('http://localhost:3001/dashboard/'+ cookie.load('cookie'))
                 .then((response) => {
                    this.setState({
                        trips : this.state.trips.concat(response.data),
                        rerendered : true
                    });
                    console.log("Trips: ", this.state.trips);
                    console.log(response);
             
             });
     }

     getNext = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        console.log("GetNextValue: ", e.target.value);
        const data = {
           name : e.target.value
        }
        console.log(data.name, this.state.selectedGetNext);
        var counter; 
        var resetcounter = true;
       
        for(var i = 0 ;i<this.state.trips.length; i++)
        {
            var testVar = this.state.trips[i].propertyname + this.state.trips[i].arrive.split('T')[0];
        
             if(data.name == testVar && data.name == this.state.selectedGetNext)
            {
            
             if(typeof(this.state.trips[i].images[this.state.count + 1])=='string') 
            {
               //Checking if image exists
             
                 counter = this.state.count + 1;  
             }
             else 
            {
               
                 counter = 0;
                 
            }
            resetcounter = false;
            break;

        }
    }
  
        if(resetcounter)
        { 
            counter = 1;
        }
        this.setState({                
          selectedGetNext : data.name,
          count : counter
        });
    }
    render(){
        
        let trips = this.state.trips.map(trip => {
            let imageView = 'data:image/jpg;base64, ';
            if(this.state.imageView == "" || this.state.selectedGetNext != (trip.propertyname+trip.arrive.split('T')[0]))
            {
                 imageView = imageView +trip.images[0];
            }
            else 
            {
                 
                imageView = imageView + trip.images[this.state.count];
            }
            return(
                <div>
                   
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-6">
                                 <img width = {'200em'}  height={'200em'} src={imageView} />
                                    <button name = "next" type = "button" className = "btn btn-secondary" onClick={this.getNext} value = {trip.propertyname+trip.arrive.split('T')[0]}>></button> 
                                   
                                </div>
                                <div className="col-sm-6">
                                    <h3>{trip.propertyname},{trip.location}</h3>
                                    <h5>Arrival Date: {trip.arrive.split('T')[0]}, Departure Date: {trip.depart.split('T')[0]}</h5>
                                    <h5>Guests: {trip.guests} Trip Cost: {trip.cost_income}</h5> 
                                </div>
                                
                        </div>
                </div>
           
             </div >
            )
        })
     
        let redirectVar = null;
        let alert = null
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }
        if(this.state.rerendered == false)
        alert = <h4>Loading your trips...</h4>
        else if (this.state.rerendered && trips.length==0)
             alert = <p>You do not have any past trips! Book a trip now : <Link to="/home">Search</Link> </p>  
      
        return(
            <div>
          {redirectVar}
                <div className="container">
                <h3> Your Trips Booked </h3>
                    <div className="row">
                        <div className="col-*-*">

                            {trips}
                            {alert}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;
