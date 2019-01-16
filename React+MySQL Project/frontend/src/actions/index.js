import axios from "axios";
import cookie from 'react-cookies';

//export const FETCH_BOOKS = "fetch_books";
//export const CREATE_BOOK = "create_book";
//export const FETCH_LOGIN = "fetch_login"
export const LOGIN = "login"
const ROOT_URL = "http://localhost:3001";

//target action
/*export function fetchlogin() {
  //middleware call
  //receive response from backend
  const response = axios.get(`${ROOT_URL}/login`);
  //Action dispatched
  console.log("Response",response);
  return {
    type: FETCH_LOGIN,
    payload: response
  };
}*/

export function login(values, callback) {

  const request = axios
    .post(`${ROOT_URL}/login`, values)
    .then(() => callback());
  //  .then(response =>  {console.log("response: ", response.data);
   //                     console.log("cookie: ", cookie.load('cookie'))})


  return {
    type: LOGIN,
    payload: request
  };
}


