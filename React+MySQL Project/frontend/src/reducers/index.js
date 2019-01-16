import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

const rootReducer = combineReducers({
//  login: LoginReducer,
  form: formReducer
});

export default rootReducer;
