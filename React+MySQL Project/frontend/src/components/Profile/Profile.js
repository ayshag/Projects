import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';


class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            image : "",
            name : "",
            phone:"",
            aboutme: "",
            city: "",
            country : "",
            company : "",
            school: "",
            hometown: "",
            languages: "",
            gender : "",
           // selectedFile: '',
           // imageView : ''
        }
        //Bind the handlers to this class
        this.imageChangeHandler = this.imageChangeHandler.bind(this);
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.aboutmeChangeHandler = this.aboutmeChangeHandler.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.countryChangeHandler = this.countryChangeHandler.bind(this);
        this.schoolChangeHandler = this.schoolChangeHandler.bind(this);
        this.hometownChangeHandler = this.hometownChangeHandler.bind(this);
        this.languagesChangeHandler = this.languagesChangeHandler.bind(this);
        this.genderChangeHandler = this.genderChangeHandler.bind(this);
        this.submitUpdate = this.submitUpdate.bind(this);
 }

    componentDidMount(){
        console.log("Did Mount Profile");
     
        axios.get('http://localhost:3001/profile/'+ cookie.load('cookie'))
        .then(response => {
            
            console.log("Response at Get Profile FE : ",response);
            this.setState(
            {
            authFlag : false,
            name : response.data[0].uname,
            phone: response.data[0].phone,
            aboutme: response.data[0].aboutme,
            city: response.data[0].city,
            country : response.data[0].country,
            company : response.data[0].company,
            school: response.data[0].school,
            hometown: response.data[0].hometown,
            languages: response.data[0].languages,
            gender : response.data[0].gender
               
            });
           
        });
    }


    imageChangeHandler = (e) => {
        this.setState({
            image : e.target.value
        })
    }
     
     nameChangeHandler = (e) => {
        this.setState({
            name : e.target.value
        })
    }
    
   
    phoneChangeHandler = (e) => {
        this.setState({
            phone : e.target.value
        })
    }
    aboutmeChangeHandler = (e) => {
        this.setState({
            aboutme : e.target.value
        })
    }
     
    cityChangeHandler = (e) => {
        this.setState({
            city : e.target.value
        })
    }
    
    countryChangeHandler = (e) => {
        this.setState({
            country : e.target.value
        })
    }

  
    schoolChangeHandler = (e) => {
        this.setState({
            school : e.target.value
        })
    }
     
    hometownChangeHandler = (e) => {
        this.setState({
            hometown : e.target.value
        })
    }
    
    languagesChangeHandler = (e) => {
        this.setState({
            languages : e.target.value
        })
    }
    
    genderChangeHandler = (e) => {
        this.setState({
            gender : e.target.value
        })
    }

    //submit Login handler to send a request to the node backend
    submitUpdate = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email : cookie.load('cookie'),
            image : this.state.image,
            name : this.state.name,
            phone : this.state.phone,
            aboutme : this.state.aboutme,
            city : this.state.city,
            country : this.state.country, 
            school : this.state.school,
            hometown : this.state.hometown,
            languages : this.state.languages,
            gender : this.state.gender

        }
       console.log("SubmitUpdateProfile",data);
        axios.post('http://localhost:3001/profile',data)
            .then(response => {
                console.log("UpdatePostRequest",data);
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                   // response.Content-Type
                    console.log("Sending Post Profile / Update Request to Backend");
                }
            });

            axios.get('http://localhost:3001/profile/'+ cookie.load('cookie'))
        .then(response => {
            
            console.log("Response at Get Profile FE : ",response);
            this.setState(
            {
            authFlag : false,
            name : response.data[0].uname,
            phone: response.data[0].phone,
            aboutme: response.data[0].aboutme,
            city: response.data[0].city,
            country : response.data[0].country,
            company : response.data[0].company,
            school: response.data[0].school,
            hometown: response.data[0].hometown,
            languages: response.data[0].languages,
            gender : response.data[0].gender
               
            });
           
        });
    }

    
    render(){
        //redirect based on successful login
        let redirectVar = null;
        if(cookie.load('cookie')){
            redirectVar = <Redirect to= "/home"/>
        }
        
        return(
          <div>
           
            <div className="container">
                
                <div className="signup-form">
                    <div className="main-div">
                        <div className="panel">
                            <h2>Traveller Profile</h2>
                            
                        </div>
                        <div className="form-group">
                                <input onChange = {this.image} type="text" className="form-control" name="image" value={this.state.image} placeholder="Profile Image"/>
                              </div> 
                            <div class="form-group">
                                
                                <input onChange = {this.nameChangeHandler} type="text" className="form-control" name="name" value={this.state.name} placeholder="Name"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.phoneChangeHandler} type="text" className="form-control" name="phone" pattern={'[0-9]{10}'} value={this.state.phone} placeholder="Phone Number (10 digits required)"/>
                              </div>                        
                            <div className="form-group">
                                <input onChange = {this.aboutmeChangeHandler} type="text" className="form-control" name="aboutme" value={this.state.aboutme} placeholder="About Me"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.cityChangeHandler} type="text" className="form-control" name="city" value={this.state.city} placeholder="City"/>
                            </div>
                            <div className="form-group">
                                
                                <input onChange = {this.countryChangeHandler} type="text" className="form-control" name="country" value={this.state.country} placeholder="Country"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.schoolChangeHandler} type="text" className="form-control" name="school" value={this.state.school} placeholder="School"/>
                              </div>                        
                            <div className="form-group">
                                <input onChange = {this.hometownChangeHandler} type="text" className="form-control" name="hometown" value={this.state.hometown} placeholder="Hometown"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.languagesChangeHandler} type="text" className="form-control" name="languages" value={this.state.languages}placeholder="Languages"/>
                            </div>
                            <div className="form-group">
                                <input onChange = {this.genderChangeHandler} type="text" className="form-control" name="gender" value={this.state.gender} placeholder="Gender"/>
                            </div>
                            <button onClick = {this.submitUpdate} className="btn btn-primary">Update</button>                 
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

export default Profile;
