import {useEffect, useState} from 'react';
import axios from 'axios';
import {useAtom} from 'jotai';

import { profileAtom } from '../components/Profile.atom';

const EMPTY_SHIT = {
    text: ""
}

let ShitFeed = () => {
    const [shits, setShits] = useState([]);
    const [newShit, setNewShit] = useState(EMPTY_SHIT);
    const [loggedInProfile, setLoggedInProfile] = useAtom(profileAtom);

    const retrieveShits = async () => {
        let {data: shits} = await axios.get("https://deusprogrammer.com/api/shitter/shits");
        setShits(shits);
    }

    const updateNewShit = (field, value) => {
        let newShitCopy = {...newShit};
        newShitCopy[field] = value;
        setNewShit(newShitCopy);
    }

    const createShit = async () => {
        await axios.post("https://deusprogrammer.com/api/shitter/shits", {...newShit, date: new Date().toISOString()},
        {
            headers: {
                "X-Access-Token": localStorage.getItem("accessToken")
            }
        });
        setNewShit(EMPTY_SHIT);
        retrieveShits();
    }

    useEffect(() => {
        retrieveShits();
    }, []);

    return (
        <div id="container">
            {loggedInProfile ?
                <div className="new-shit">
                    <textarea type="text" placeholder="Take a shit." value={newShit.text} onChange={({target: {value}}) => {updateNewShit("text", value)}} />
                    <button onClick={createShit}>Create Shit</button>
                </div> :
                null
            }
            <div className="shits">
                { shits.map(({id, username, text, date}) => {
                    return (
                        <div key={`shit-${id}`} className="shit">
                            <div><span>{username}&nbsp;</span><span>on {new Date(Date.parse(date)).toDateString()}</span></div>
                            <div>{text}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default ShitFeed;
