import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";

import Detail from '../Component/Detail';
import Navbar from "../Component/Navbar";
import LandingPage from "../Pages/LandingPage";
import Home from "../Pages/Home";
import Collection from "../Pages/Collection";
import Profile from "../Pages/Profile";
import AddLiterature from "../Pages/AddLiterature";

export default function AppRouter() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route path={['/home', '/profile', '/collection', '/detail', '/add']}>
                        <Navbar homePage={true} />
                        <Switch>
                            <PrivateRoute exact path="/home" component={Home} />
                            <PrivateRoute path="/profile" component={Profile} />
                            <PrivateRoute path="/collection" component={Collection} />
                            <PrivateRoute path="/detail/:id" component={Detail} />
                            <PrivateRoute path="/add" component={AddLiterature} />
                        </Switch>
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}
