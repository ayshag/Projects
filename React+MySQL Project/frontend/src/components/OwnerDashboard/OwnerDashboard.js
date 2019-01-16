import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

class OwnerDashboard extends Component {
    constructor(props) {

        super(props);
        this.state = {
            properties: [],
            bookings: [],
            owner: true,
            count: 0,
            bookingcount: 0,
            selectedGetNext: "",
            selectedGetNextBooking: "",
            rerendered: false
        }
        this.getNext = this.getNext.bind(this);
        this.getNextBooking = this.getNextBooking.bind(this);
    }
    componentWillMount() {
        var owneraccess;
        axios.get('http://localhost:3001/getuseraccess/' + cookie.load('cookie'))
            .then((response) => {

                if (response.data === 'owner')
                    owneraccess = true;
                else
                    owneraccess = false;

                this.setState({
                    owner: owneraccess
                });
                console.log(this.state.owner);
            })
    }
    componentDidMount() {


        axios.get('http://localhost:3001/ownerdashboard/' + cookie.load('cookie'))
            .then((response) => {
                this.setState({
                    bookings: this.state.bookings.concat(response.data),
                    rerendered: true

                });
            });

        axios.get('http://localhost:3001/ownerdashboardprops/' + cookie.load('cookie'))
            .then((response) => {
                this.setState({
                    properties: this.state.properties.concat(response.data),

                });
            });
    }

    getNext = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        console.log("GetNextValue: ", e.target.value);
        const data = {
            name: e.target.value
        }
        console.log(data.name, this.state.selectedGetNext);
        var counter;
        var resetcounter = true;

        for (var i = 0; i < this.state.properties.length; i++) {

            var testVar = this.state.properties[i].propertyname;

            if (data.name == testVar && data.name == this.state.selectedGetNext) {

                if (typeof (this.state.properties[i].images[this.state.count + 1]) == 'string') {
                    //Checking if image exists

                    counter = this.state.count + 1;
                }
                else {
                    counter = 0;
                }
                resetcounter = false;
                break;

            }
        }

        if (resetcounter) {
            counter = 1;
        }
       
        this.setState({
            selectedGetNext: data.name,
            count: counter
        });
    }

    getNextBooking = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        console.log("GetNextBookingValue: ", e.target.value);
        const data = {
            name: e.target.value
        }
        console.log(data.name, this.state.selectedGetNextBooking);
        var bookingcounter;
        var resetcounter = true;

        for (var i = 0; i < this.state.bookings.length; i++) {

            var testVar = this.state.bookings[i].propertyname + this.state.bookings[i].arrive.split('T')[0];

            if (data.name == testVar && data.name == this.state.selectedGetNextBooking) {

                if (typeof (this.state.bookings[i].images[this.state.bookingcount + 1]) == 'string') {
                    //Checking if image exists

                    bookingcounter = this.state.bookingcount + 1;
                }
                else {
                    bookingcounter = 0;

                }
                resetcounter = false;
                break;

            }
        }

        if (resetcounter) {
            bookingcounter = 1;
        }

        this.setState({
            selectedGetNextBooking: data.name,
            bookingcount: bookingcounter
        });
        console.log(this.state.selectedGetNextBooking);
        console.log(this.state.bookingcount);
    }
    render() {

        //  <img width = {'200em'}  height={'200em'} src={'data:image/jpg;base64, ' +property.image} />
        let properties = this.state.properties.map(property => {
            let imageView = 'data:image/jpg;base64, ';
            if (this.state.imageView == "" || this.state.selectedGetNext != property.propertyname) {
                imageView = imageView + property.images[0];
            }
            else {

                imageView = imageView + property.images[this.state.count];
            }
            return (

                <div className="container">
                    <div className="row">
                        <div className="col-sm-6">
                            <img width={'200em'} height={'200em'} src={imageView} />
                            <button name="next" type="button" className="btn btn-secondary" onClick={this.getNext} value={property.propertyname}>></button>
                        </div>
                        <div className="col-sm-6">
                            <h3>{property.propertyname},{property.location}</h3>
                            <h5> Type: {property.type} | Bedrooms: {property.bedrooms} | Bathrooms: {property.bathrooms} | Sleeps: {property.sleeps} | Price: {property.price} </h5>
                            <h5> Available From: {property.availablestart.split('T')[0]} | Available Till : {property.availableend.split('T')[0]}</h5>

                        </div>

                    </div>
                </div>

            )
        })
        let bookings = this.state.bookings.map(booking => {
            let bookingimageView = 'data:image/jpg;base64, ';
            if (this.state.bookingimageView == "" || this.state.selectedGetNextBooking != (booking.propertyname + booking.arrive.split('T')[0])) {
                bookingimageView = bookingimageView + booking.images[0];
            }
            else {

                bookingimageView = bookingimageView + booking.images[this.state.bookingcount];
            }
            return (
                <div>

                    <div className="container">
                        <div className="row" >
                            <div className="col-sm-6">
                                <img width={'200em'} height={'200em'} src={bookingimageView} />
                                <button name="next" type="button" className="btn btn-secondary" onClick={this.getNextBooking} value={booking.propertyname + booking.arrive.split('T')[0]}>></button>
                            </div>
                            <div className="col-sm-6">
                                <h3>{booking.propertyname},{booking.location}</h3>
                                <h5>Booked by: {booking.username}</h5>
                                <h5>Arrival Date: {booking.arrive.split('T')[0]}, Departure Date: {booking.depart.split('T')[0]}</h5>
                                <h5> Trip Income: {booking.cost_income}</h5>
                            </div>
                        </div>
                    </div>

                </div >
            )
        })
        //redirect based on successful login
        let redirectVar = null;
        let alertbookings = null;
        let alertproperties = null;
        let redirectNotOwner = null;

        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        if (!this.state.owner)
            redirectNotOwner = <Redirect to="/home" />

        if (this.state.rerendered == false) {
            alertbookings = <h4>Loading traveler bookings for you properties...</h4>
            alertproperties = <h4>Loading your properties...</h4>
        }

        if (this.state.rerendered && bookings.length == 0)
            alertbookings = <h3>You do not have any traveler bookings on properties </h3>
        if (this.state.rerendered && properties.length == 0)
            alertproperties = <h3>You do not have any properties. </h3>

        return (
            <div>
                {redirectNotOwner}
                {redirectVar}
                <h3> Your Properties </h3>
                <div className="container">

                    <div className="row">
                        <div className="col-*-*">
                            {alertproperties}
                            {properties}
                        </div>
                    </div>
                </div>
                <h3> Traveler Bookings  On Your Properties </h3>
                <div className="container">

                    <div className="row">
                        <div className="col-*-*">
                            {alertbookings}
                            {bookings}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default OwnerDashboard;
