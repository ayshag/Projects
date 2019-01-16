import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Calculator from './Calculator/Calculator';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
               
                <Route path="/" component={Calculator}/>
                 
            </div>
        )
    }
}
//Export The Main Component
export default Main;

/* <Route path="/delete" component={Delete}/>
                <Route path="/create" component={Create}/>
                 <Route path="/" component={Navbar}/>
                */