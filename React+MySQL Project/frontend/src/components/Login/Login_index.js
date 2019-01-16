// import _ from "lodash";
// import React, { Component } from "react";
// import { connect } from "react-redux";
// import { Link } from "react-router-dom";
// import { fetchBooks } from "../actions";


// //view
// class Login1 extends Component {
//   componentDidMount() {
//     //call to action
//     this.props.login();
//   }

 
//   render() {
//     /*let redirectVar = null;
//     let notvalidatedalert = null;
//   if(cookie.load('cookie')){
//     console.log("Redirecting to Home");
//         redirectVar = <Redirect to= "/home"/>
//     }
//     if(this.state.validated === "Failed")
//         notvalidatedalert = <h6>Incorrect username or password entered. Please try again</h6>
//   */
//     return (
//         <div>
        
      
//      <div className="container">
         
//          <div className="login-form">
//              <div className="signin-signup">
//                  <div className="panel">
//                      <form onSubmit = {this.submitLogin}>
//                      <h3>Signin To HomeAway</h3>
//                      <h6>Don't have an account?  <Link to="/signup" >Traveler Signup</Link>  </h6>
                 
//                      <div className="form-group">
//                          <input onChange = {this.usernameChangeHandler} type="email" class="form-control" required name="username" placeholder="Username"/>
//                      </div>
//                      <div className="form-group">
//                          <input onChange = {this.passwordChangeHandler} type="password" class="form-control" required name="password" placeholder="Password"/>
//                      </div>
//                      <div>{notvalidatedalert}</div>
//                      <button type="submit" className="btn btn-primary">Login</button>                 
//                      </form>
            
//              </div>
             
//          </div>
//      </div>
//      </div>
//      </div>
//     );
//   }
// }
// //This method is provided by redux and it gives access to centeral store


// export default connect(mapStateToProps, { fetchlogin })(Login1);


// //  {redirectVar}