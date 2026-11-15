import React, {Suspense} from 'react';
import {Routes, Route, NavLink} from "react-router-dom";

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
            </AppBar>
            <Toolbar/>
            <Suspense fallback={<div>Loading...</div>}>
                <Container>
                    <Routes>
                        <Route path="/about" element={<About/>}/>
                        <Route path="/users" element={<User/>}/>
                        <Route path="/" element={<Home/>}/>
                    </Routes>
                </Container>
            </Suspense>
        </React.Fragment>
    );
}
