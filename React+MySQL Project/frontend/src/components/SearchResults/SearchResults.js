import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'

class SearchResults extends Component {
    constructor() {
        super();
        this.state = {
            searchresults: [],
            name: "",
            submit: false,
            count: 0,
            selectedGetNext: "",
            rerendered : false

        }
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.getNext = this.getNext.bind(this);

        this.submitSelect = this.submitSelect.bind(this);
    
    }

    componentDidMount() {
        console.log("Did Mount Search Results");


        axios.get('http://localhost:3001/searchresults')
            .then((response) => {
               
              
                this.setState({
                    searchresults: this.state.searchresults.concat(response.data),
                    rerendered : true,
                   
                });
            });


    }
    nameChangeHandler = (e) => {
        this.setState({
            name: e.target.value
        })
        
    }
    submitSelect = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        console.log(this.state.name);
        const data = {
            name: this.state.name,
            arrive: sessionStorage.getItem('arrive'),
            depart: sessionStorage.getItem('depart'),
            guests: sessionStorage.getItem('guests')

        }


        axios.post('http://localhost:3001/searchresults', data)
            .then(response => {
              
                this.setState({
                    submit: true

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

        for (var i = 0; i < this.state.searchresults.length; i++) {

            var testVar = this.state.searchresults[i].propertyname;
            if (data.name == testVar && data.name == this.state.selectedGetNext) {
                if (typeof (this.state.searchresults[i].images[this.state.count + 1]) == 'string') {
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
        }

        );


    }


    render() {



        let searchresults = this.state.searchresults.map(searchresult => {

            let imageView = 'data:image/jpg;base64, ';
            if (this.state.imageView == "" || this.state.selectedGetNext != searchresult.propertyname) {
                imageView = imageView + searchresult.images[0];
            }
            else {

                imageView = imageView + searchresult.images[this.state.count];
            }
         

            return (
                <div>

                    <form onSubmit={this.submitSelect} >
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-6">

                                    <img width={'200em'} height={'200em'} src={imageView} />
                                    <button name="next" type="button" className="btn btn-secondary" onClick={this.getNext} value={searchresult.propertyname}>></button>

                                </div>
                                <div className="col-sm-6">
                                    <p>
                                        <input type="submit" className="btn btn-link" name="details" onClick={this.nameChangeHandler} value={searchresult.propertyname}></input>

                                    </p>
                                    Type: {searchresult.type} | Bedrooms: {searchresult.bedrooms} | Bathrooms: {searchresult.bathrooms} | Sleeps: {searchresult.sleeps} | Price: {searchresult.price}
                                </div>
                            </div>
                        </div>
                    </form>
                </div >
            )
        })
        let redirectVar = null;
        let alert = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        else if (this.state.submit) {
            redirectVar = <Redirect to="/details" />

        }
        if(this.state.rerendered == false)
            alert = <h4>Searching for properties...</h4>
        else if (this.state.rerendered && searchresults.length == 0)
            alert = <h4>Sorry, no properties available for entered combination</h4>
        return (
            <div>
                {redirectVar}
                <div>
                    <div className="input-group">
                        <input type="text" className="form-control" name="destination" defaultValue={sessionStorage.getItem('destination')} placeholder = {"Destination"} />
                        <input type="text" className="form-control" name="arrive" defaultValue={sessionStorage.getItem('arrive')} placeholder={"Date of Arrival"}  onFocus ={(e) => e.target.type = "date"}  />
                        <input type="text" className="form-control" name="depart" defaultValue={sessionStorage.getItem('depart')} placeholder={"Date of Departure"}  onFocus ={(e) => e.target.type = "date"} />
                        <input type="text" className="form-control" name="guests" defaultValue={sessionStorage.getItem('guests')} placeholder={"Guests"} />
                    </div>
                    
                    <div className="container">

                        <div className="row">
                            <div className="col-*-*">
                                {alert}
                                {searchresults}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            

        )
    }
}


export default SearchResults;
