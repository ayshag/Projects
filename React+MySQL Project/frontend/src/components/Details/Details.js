import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
//import Login from './Login/Login';


class Details extends Component {
    constructor() {
        super();
        this.state = {
            propertydetails: [],
            name: "",
            back: false,
            submit: false,
            count : 0

        }
        this.submitBook = this.submitBook.bind(this);
        this.getNext = this.getNext.bind(this);
        this.arriveChangeHandler = this.arriveChangeHandler.bind(this);
    }

    componentDidMount() {
        console.log("Did Mount Details");
        console.log(sessionStorage.getItem('SelectedProperty'));
        const data = { name: sessionStorage.getItem('SelectedProperty') };
        axios.get('http://localhost:3001/details', data)
            .then((response) => {
                this.setState({
                   
                    propertydetails: this.state.propertydetails.concat(response.data)
                  
                })
               
            });
        
    }

    arriveChangeHandler = (e) => {
        this.setState({
            arrive : e.target.value
        })
    }
    submitBack = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();

        this.setState()

    }

    submitBook = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            name: this.state.propertydetails[0].propertyname,
            arrive: sessionStorage.getItem('arrive'),
            depart: sessionStorage.getItem('depart'),
            guests: sessionStorage.getItem('guests'),
            user: cookie.load('cookie'),
            totalcost: this.state.propertydetails[0].totalcost
        
        }
        axios.post('http://localhost:3001/details', data)
            .then((response) => {

                console.log("Response at Post Details", response);
                this.setState({
                   
                    submit: true
                });

            });

    }

    getNext = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        var counter;
       
        if(typeof(this.state.propertydetails[0].images[this.state.count + 1])==="string")
            counter = this.state.count + 1;   
        else
            counter = 0;  
    
        this.setState({               
     
          count : counter
        });
        
    }




    render() {

        let redirectVar = null;
        let available = null;
        //   if(propertydetails.available)
        available = "Available"
        //  else    
        //      available = "Unavailable"


        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        else if (this.state.submit) {
            console.log("Submit: ", this.state.submit);
            redirectVar = <Redirect to="/dashboard" />

        }

        let image = this.state.propertydetails.map(printimage => {
            
            let imageView = 'data:image/jpg;base64, ' + printimage.images[this.state.count];
            return (
             
               <div>
               <img width = {'300em'}  height={'300em'} src={imageView} />
               <button name = "next" type = "button" className = "btn btn-secondary" onClick={this.getNext}>></button> 
               </div>
         
            )
        });
        let totalcost = this.state.propertydetails.map(printcost => {
            return (
                <p>Total   $ {printcost.totalcost}</p>
            )
        });




        let printdetails = this.state.propertydetails.map(printdetail => {
            return (
                <div>

                    <h2>{printdetail.propertyname}</h2>

                    <h6>Type: {printdetail.type} | Bedrooms: {printdetail.bedrooms} | Bathrooms: {printdetail.bathrooms} | Sleeps: {printdetail.sleeps} </h6>
                    <h6>{printdetail.amenities}</h6>

                </div>
            )
        });
        let printingprice = this.state.propertydetails.map(pricepernight => {
            return (
                <div>
                    {redirectVar}
                    <div>
                        <h2> ${pricepernight.price}</h2>
                        <h5>per night</h5>
                    </div>
                </div>
            )
        });


        return (
            <div>
                <button onClick={this.submitBack} name="back" className="btn btn-primary">Back to Search</button>
                <div className="container">
                    <div>

                        <div className="row">
                            <div className="col-sm-6">
                                {image}
                            </div>
                            <div className="col-sm-6">
                                <div className="container">
                                    <div>{printingprice}</div>
                                    <p>Your dates are {available}</p>
                                    <div className="form-group">
                                        <input onChange = {this.arriveChangeHandler} type="date" className="form-control" name="arrive" value={sessionStorage.getItem('arrive')} placeholder="Arrive" />
                                    </div>
                                    <div className="form-group">
                                        <input /*onChange = {this.departChangeHandler}*/ type="date" className="form-control" name="depart" value={sessionStorage.getItem('depart')} placeholder="Depart" />
                                    </div>
                                    <div className="form-group">
                                        <input /*onChange = {this.guestsChangeHandler}*/ type="text" className="form-control" name="guests" value={sessionStorage.getItem('guests')} placeholder="Guests" />
                                    </div>
                                    <div className="form-group">
                                        {totalcost}
                                    </div>
                                    <button onClick={this.submitBook} className="btn btn-primary">Book Now</button>

                                </div>
                            </div>
                        </div>
                        <div class="row">
                            {printdetails}


                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
//  {redirectVar}
//export Home Component
export default Details;

