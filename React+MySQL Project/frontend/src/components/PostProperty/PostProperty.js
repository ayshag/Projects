import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';



class PostProperty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: "",
            name: "",
            type: "",
            bedrooms: "",
            bathrooms: "",
            sleeps: "",
            pricing: "",
            amenities: "",
            availablestart: "",
            availableend : "",
          
            selectedFile: '',
            images : '',
            submit: false,
            owner : true,
            uniquePropName : ""
        }
        //Bind the handlers to this class
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.typeChangeHandler = this.typeChangeHandler.bind(this);
        this.bedroomsChangeHandler = this.bedroomsChangeHandler.bind(this);
        this.bathroomsChangeHandler = this.bathroomsChangeHandler.bind(this);
        this.sleepsChangeHandler = this.sleepsChangeHandler.bind(this);
        this.pricingChangeHandler = this.pricingChangeHandler.bind(this);
        this.amenitiesChangeHandler = this.amenitiesChangeHandler.bind(this);

        this.availablestartChangeHandler = this.availablestartChangeHandler.bind(this);
        this.availableendChangeHandler = this.availableendChangeHandler.bind(this);

        this.submitPostProperty = this.submitPostProperty.bind(this);
    }
    componentWillMount()
    {
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
    locationChangeHandler = (e) => {
        this.setState({
            location: e.target.value
        })

    }

    nameChangeHandler = (e) => {
        this.setState({
            name: e.target.value,
            uniquePropName : ""
        })
    }
    typeChangeHandler = (e) => {
        this.setState({
            type: e.target.value
        })
    }
    bedroomsChangeHandler = (e) => {
        this.setState({
            bedrooms: e.target.value
        })
    }
    bathroomsChangeHandler = (e) => {
        this.setState({
            bathrooms: e.target.value
        })
    }
    sleepsChangeHandler = (e) => {
        this.setState({
            sleeps: e.target.value
        })
    }

    pricingChangeHandler = (e) => {
        this.setState({
            pricing: e.target.value
        })
    }

    amenitiesChangeHandler = (e) => {
        this.setState({
            amenities: e.target.value
        })
    }


    availablestartChangeHandler = (e) => {
        this.setState({
            availablestart: e.target.value
        })
    }

    availableendChangeHandler = (e) => {
        this.setState({
            availableend: e.target.value
        })
    }

    onChangeimages = (e) => {
     
        if(e.target.name == 'images'){
       console.log(e.target.files);
          this.setState({
            images: e.target.files
         })
        }else{
            
          this.setState({ [e.target.name]: e.target.value });
        }
       console.log(this.state.images);
    }
  

    submitPostProperty = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const images  = this.state.images;
        console.log(images);
        let formData = new FormData();
        const data = {filename : this.state.name  };
       for(var i = 0; i<images.length; i++)
        {
     //         formData.append('')
          formData.append("images[]",images[i]);
        }
   //     formData.append('images', images);
        

        axios.post('http://localhost:3001/setphotoname', data)
        .then((result) => {
            axios.post('http://localhost:3001/uploadpropphotos', formData)
            .then((result) => {});
        });

        const propdata = {
            location: this.state.location,
            name: this.state.name,
            type: this.state.type,
            bedrooms: this.state.bedrooms,
            bathrooms: this.state.bathrooms,
            sleeps: this.state.sleeps,
            pricing: this.state.pricing,
            amenities: this.state.amenities,
            availablestart: this.state.availablestart,
            availableend : this.state.availableend,
            owner :  cookie.load('cookie')

        }
       
       
        axios.post('http://localhost:3001/postproperty', propdata)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
            
                   console.log(response.data);
                    if(response.data == "Failed" )
                    {
                        
                        this.setState({
                            uniquePropName : "Failed"
                        })
                    }
                    else
                    {
                    this.setState({
                     
                        submit: true
                      
                    });
                    }
                }
            });
    }

      uploadMultiple = (e) =>
      {
        e.preventDefault();
          const images  = this.state.images;
          console.log(images);
          let formData = new FormData();
          const data = {filename : this.state.name  };
         for(var i = 0; i<images.length; i++)
          {
      
            formData.append("images[]",images[i]);
          }
   

          axios.post('http://localhost:3001/setphotoname', data)
          .then((result) => {
              axios.post('http://localhost:3001/uploadpropphotos', formData)
              .then((result) => {});
          });

          
    
      }
    render() {
        //redirect based on successful login
        let redirectVar = null;
        let redirectNotOwner = null;


        let uniquePropNameAlert = null;
      
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        
        if(!this.state.owner)
             redirectNotOwner = <Redirect to="/home" />
        console.log("Submit: ", this.state.submit);
        
        if(this.state.uniquePropName == "Failed")
        uniquePropNameAlert = <h5>Property already exists with this name. Please pick another property name</h5>

         if (this.state.submit) {
            console.log("Submit: ", this.state.submit);
            redirectVar = <Redirect to="/ownerdashboard" />

        }
        const { selectedFile,images } = this.state;
        return (
            <div>
            {redirectNotOwner}
          {redirectVar}
                <div className="container">

                    <div className="signup-form">
                        <div className="main-div">
                            <div className="panel">
                                <h2>Post Property</h2>

                            </div>
                            <form onSubmit={this.submitPostProperty} enctype="multipart/form-data" >
                            <div className="form-group">
                                <input onChange={this.locationChangeHandler} required type="text" className="form-control" name="location" placeholder="Location" />
                            </div>
                            <div className="form-group">
                                <input onChange={this.nameChangeHandler} required type="text" className="form-control" name="name" placeholder="Name" />
                            </div>
                            <div>{uniquePropNameAlert}</div>
                            <div className="form-group">
                                <input onChange={this.typeChangeHandler} type="text" className="form-control" name="type" placeholder="Type" />
                            </div>
                            <div className="form-group">

                                <input onChange={this.bedroomsChangeHandler} type="text" className="form-control" name="bedrooms" placeholder="Bedrooms" />
                            </div>
                            <div className="form-group">

                                <input onChange={this.bathroomsChangeHandler} type="text" className="form-control" name="bathrooms" placeholder="Bathrooms" />
                            </div>
                            <div className="form-group">

                                <input onChange={this.sleepsChangeHandler} type="text" className="form-control" required name="sleeps" placeholder="Sleeps" />
                            </div>
                          
                            <div className="form-group">
                                <input onChange={this.pricingChangeHandler} type="text" className="form-control" name="pricing" required="true" placeholder="Pricing" />
                            </div>
                            <div className="form-group">

                                <input onChange={this.amenitiesChangeHandler} type="text" className="form-control" name="amenities" placeholder="Amenities" />
                            </div>
                            <div className="form-group">
                              Available Start Date:  <input onChange={this.availablestartChangeHandler} type="date" className="form-control" name="availablestart" required placeholder="Available Start Date" />
                            </div>
                            <div className="form-group">
                              Available End Date:    <input onChange={this.availableendChangeHandler} type="date" className="form-control" name="availableend" required placeholder="Available End Date" />
                          </div>
                            <div>
                                Upload Property Photos
                               
                             <input type="file" multiple name="images"  onChange={this.onChangeimages} />
                                  
                                <div>
                                    <img width={'200em'} height={'200em'} src={this.state.imageViews} />
                                </div>
                            </div>

                        

                            <button type = "submit" className="btn btn-primary">Post Property</button>
                            </form>
                              </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PostProperty;
