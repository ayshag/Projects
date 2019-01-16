import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';


class Calculator extends Component {
    constructor() {
        super();
        this.state = {
            input: "",
            operator: null,
            
            result: "0",
         

        }
        this.inputChangeHandler = this.inputChangeHandler.bind(this);

        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
        this.divide = this.divide.bind(this);
        this.multiply = this.multiply.bind(this);
        this.result = this.result.bind(this);
        
    }
    inputChangeHandler = (e) => {
        var res = null;
      
        this.setState({
            input: e.target.value,
            result: res
        })

    }


    componentDidMount() {

        axios.get('http://localhost:3001/')
            .then((response) => {
                console.log("Did Mount");
            });
    }

    add = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();

        const data = {
            input: this.state.input,
            operator: '+'
        }

        axios.post('http://localhost:3001/', data)
            .then(response => {
                this.setState({
                    result: response.data,
                    input: ""
                })
            });

    }

    subtract = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            input: this.state.input,
            operator: '-'
        }


        axios.post('http://localhost:3001/', data)
            .then(response => {
                this.setState({
                     result : response.data,
                    input: ""
                })
            });
    }

    divide = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            input: this.state.input,
            operator: '/'
        }

        axios.post('http://localhost:3001/', data)
            .then(response => {
                this.setState({
                       result : response.data,
                    input: ""
                })
            });
    }

    multiply = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            input: this.state.input,
            operator: '*'
        }


        axios.post('http://localhost:3001/', data)
            .then(response => {
                this.setState({
                     result : response.data,
                    input: ""
                })
            });
    }

    result = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            input: this.state.input,
            operator: '='
        }

        //make a post request with the user data
        axios.post('http://localhost:3001/', data)
            .then(response => {
                console.log(response);
                this.setState({
                    result: response.data,
                    input: "",
                   
                })
            });


    }

    render() {

        return (

            
            <div>
            
            <div className = "bordered-div">
                <div class="container">


                 <div className > <h2>Calculator</h2></div>
               
                <form onSubmit={this.result}>
                    <div class="form-group">
                        <input onChange={this.inputChangeHandler} type="text" class="form-control" name="input" pattern ={'[0-9]{1,}'} value={this.state.input} />
                    </div>  
                    <div class="form-group">
                    <div className="row">
                    <div className = "col-sm-1">
                        <button type="submit" onClick={this.add} class="btn btn-secondary">+</button>
                        </div>
                        <div className = "col-sm-1">
                        <button type="submit" onClick={this.subtract} class="btn btn-secondary">-</button>
                        </div>
                        <div className = "col-sm-1">
                        <button type="submit" onClick={this.multiply} class="btn btn-secondary">x</button>
                        </div>
                        <div className = "col-sm-1">
                        <button type="submit" onClick={this.divide} class="btn btn-secondary">/</button>
                        </div>
                        <div className = "col-sm-1">
                        <button type="submit" className="btn btn-secondary">=</button>
                        </div>
                    </div>
                    </div>

                    <div class="form-group">
                        <h5 name="result">Result: {this.state.result}</h5>
                    </div>
                </form>
                </div>
            </div>
                </div>
           

        )
    }
}
export default Calculator;
