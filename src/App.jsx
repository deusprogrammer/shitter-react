import { useEffect, useState } from 'react'; 
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useAtom} from 'jotai';

import { profileAtom } from './components/Profile.atom';
import ShitFeed from './routes/ShitFeed';
import Dev from './devComponents/Dev';

import './App.css';

let RoutePage = () => {
    const [loggedInUserProfile, setLoggedInUserProfile] = useAtom(profileAtom);
    const navigate = useNavigate();
    
    const getUserProfile = async () => {
        // If no access token is present, don't retrieve their information
        if (!localStorage.getItem("accessToken")) {
            return;
        }

        try {
            let {data: profile} = await axios.get(`https://deusprogrammer.com/api/profile-svc/users/~self`, {
                headers: {
                    "X-Access-Token": localStorage.getItem("accessToken")
                }
            });

            if (profile.username !== null) {
                setLoggedInUserProfile(profile);
                navigate(`${process.env.PUBLIC_URL}/feed`);
            }
        } catch (error) {
            console.error("Unable to load logged in user");
        }
    }

    const login = () => {
        if (process.env.NODE_ENV === "development") {
            window.location = `https://deusprogrammer.com/util/auth/dev?redirect=${window.location.protocol}//${window.location.hostname}:${window.location.port}${process.env.PUBLIC_URL}/dev`;
            return;
        }
        window.localStorage.setItem("twitchRedirect", "https://deusprogrammer.com/shitter");
        window.location.replace("https://deusprogrammer.com/api/auth-svc/auth/twitch");
    }

    useEffect(() => {
        getUserProfile();
    }, []);
    
    return (
        <div>
            <header>
                <div>{loggedInUserProfile ? `Logged in as ${loggedInUserProfile.username}` : <button onClick={login}>Login</button>}</div>
                <h1>Shitter</h1>
                <nav></nav>
            </header>
            <Routes>
                <Route path={`${process.env.PUBLIC_URL}/feed`} element={<ShitFeed />} />
                { process.env.NODE_ENV === 'development' ?
                    <Route exact path={`${process.env.PUBLIC_URL}/dev`} element={<Dev />} /> : null
                }
                <Route path="*" element={<Navigate to={`${process.env.PUBLIC_URL}/feed`} />} />
            </Routes>
            <footer>
                &copy;2022 Shitter: <span className="slogan">Take a shit on the internet today!</span>&trade;
            </footer>
        </div>
    );
}

const App = () => {
    return (
        <Router>
            <RoutePage />
        </Router>
    )
}

export default App;
