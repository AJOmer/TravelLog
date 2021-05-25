// After react 17, no need to import react anymore \\
import { Cancel, Room } from "@material-ui/icons";
import axios from "axios";
import { useRef, useState } from "react";
import "../css/Register.css";


//RFC shortcut for function component\\
export default function Register({ setShowRegistration }) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const userNameRef = useRef();
    const emailRef = useRef()
    const passwordRef = useRef();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            userName: userNameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        try {
            await axios.post("/users/register", newUser);
            setError(false);
            setSuccess(true);
        } catch (err) {
            setError(true);
        }
    }

    return (
        <div className ="registerContainer">
            <div className="logo">
                <div className="logo">
                    <Room/>
                    Destination
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Enter a username" ref={userNameRef}/>
                <input type="email" placeholder="Email address" ref={emailRef}/>
                <input type="password" placeholder="Password" ref={passwordRef}/>
                <button className="registerBtn">Register</button>
                {success && (<span className="success">Registered! Proceed to login.</span>)}
                {error && <span className="failure">Issue with registration</span>}
            </form>
            <Cancel className="cancelButton" onClick={() => setShowRegistration(false)} />
        </div>
    )
}
