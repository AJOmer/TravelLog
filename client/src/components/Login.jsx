// After react 17, no need to import react anymore \\
import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "../css/Login.css";


//RFC shortcut for function component\\
export default function Login({ setShowLogin, myStorage, setCurrUser }) {
    const [error, setError] = useState(false);
    const userNameRef = useRef();
    const passwordRef = useRef();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            userName: userNameRef.current.value,
            password: passwordRef.current.value
        }
        try {
            const res = await axios.post("/users/login", user);
            myStorage.setItem("user", res.data.userName);
            setCurrUser(res.data.userName);
            setShowLogin(false);
        } catch (err) {
            setError(true);
        }
    }

    return (
        <div className ="loginContainer">
            <div className="logo">
                <div className="logo">
                    <Room/>
                    Destination
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter a username" ref={userNameRef}/>
                <input type="password" placeholder="Password" ref={passwordRef}/>
                <button className="loginBtn">Login</button>
                {error && <span className="failure">Issue with login</span>}
            </form>
            <Cancel className="cancelButtonLogin" onClick={() => setShowLogin(false)} />
        </div>
    )
}
