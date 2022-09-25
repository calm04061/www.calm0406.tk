import React from "react";
import {Switch, Route, NavLink} from "react-router-dom";
import Home from "./view/Home";
import {AppBar, IconButton, Container, Toolbar} from "@mui/material";

export default function App() {
    return (
        <React.Fragment>
            <AppBar>
                <Container>
                    <Toolbar>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <NavLink to="/" className="link">Home</NavLink>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <NavLink to="/about">About</NavLink>
                        </IconButton>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                        >
                            <NavLink to="/users">Users</NavLink>
                        </IconButton>
                    </Toolbar>
                </Container>
                {/* A <Switch> looks through its children <Route>s and renders the first one that matches the current URL. */}
            </AppBar>
            <Toolbar/>
            <Container>
                <Switch>
                    <Route path="/about">
                        <About/>
                    </Route>
                    <Route path="/users">
                        <Users/>
                    </Route>
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </Container>
        </React.Fragment>
    );
}

function About() {
    return <h2>About</h2>;
}

function Users() {
    return <h2>Users</h2>;
}
