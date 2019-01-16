// import React, { Component } from "react";
// import { Field, reduxForm } from "redux-form";
// import { Link } from "react-router-dom";
// import { connect } from "react-redux";
// import { createBook } from "../actions";

// class BookNew extends Component {

//   //Define component that you wanbt to render
//   renderField(field) {
//     const { meta: { touched, error } } = field;
//     const className = `form-group ${touched && error ? "has-danger" : ""}`;

//     return (
//       <div className={className}>
//         <label>{field.label}</label>
//         <input className="form-control" type="text" {...field.input} />
//         <div className="text-help">
//           {touched ? error : ""}
//         </div>
//       </div>
//     );
//   }
//   /*Action call
//   Whenever onSubmit event is triggered, execute an action call called createBook 
//   */
//   onSubmit(values) {
//     console.log(values);
//     this.props.createBook(values, () => {
//       this.props.history.push("/");
//     });
//   }

//   render() {
//     const { handleSubmit } = this.props;

//     return (

//       //handleSubmit is the method that comes from redux and it tells redux what to do with the submitted form data
//       //Field is a component of redux that does the wiring of inputs to the redux store.
//       <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
      
//         <Field
//           label="Book_Id"
//           name="BookID"
//           component={this.renderField}
//         />

//         <Field
//           label="Title_For_Book"
//           name="Title"
//           component={this.renderField}
//         />
//         <Field
//           label="Author"
//           name="Author"
//           component={this.renderField}
//         />
//         <button type="submit" className="btn btn-primary">Submit</button>
//         <Link to="/" className="btn btn-danger">Cancel</Link>
//       </form>
//     );
//   }
// }

// function validate(values) {

//   const errors = {};

//   // Validate the inputs from 'values'
//   if (!values.BookID) {
//     errors.BookID = "Enter an ID";
//   }
//   if (!values.Title) {
//     errors.Title = "Enter Title";
//   }
//   if (!values.Author) {
//     errors.Author = "Enter Author";
//   }

//   // If errors is empty, the form is fine to submit
//   // If errors has *any* properties, redux form assumes form is invalid
//   return errors;
// }

// export default reduxForm({
//   // validate,
//   form: "NewBookForm"
// })(connect(null, { createBook })(BookNew));
