import React, {Suspense} from 'react';
import {Switch, Route, NavLink} from "react-router-dom";

import {AppBar, IconButton, Container, Toolbar} from "@mui/material";

const Home = React.lazy(() => import('./view/Home'));
const About = React.lazy(() => import('./view/About'));
const User = React.lazy(() => import('./view/User'));

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
                        <Suspense fallback={<div>Loading...</div>}>
                            <About/>
                        </Suspense>
                    </Route>
                    <Route path="/users">
                        <Suspense fallback={<div>Loading...</div>}>
                            <User/>
                        </Suspense>
                    </Route>
                    <Route path="/">
                        <Suspense fallback={<div>Loading...</div>}>
                            <Home/>
                        </Suspense>
                    </Route>
                </Switch>
            </Container>
        </React.Fragment>
    );
}
