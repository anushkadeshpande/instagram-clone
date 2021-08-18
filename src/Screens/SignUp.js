import { useState, useRef } from 'react'
import { auth } from '../firebase'
import firebase from 'firebase'
import { db, userDb } from '../firebase'
import { Link, Redirect } from 'react-router-dom'
import './SignUp.css'
import FacebookIcon from '@material-ui/icons/Facebook';

function SignUp() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [signedUp, setSignedUp] = useState(false)
    const [ isEmailSet, setEmailStatus ] = useState(false)
    const [ isPasswordSet, setPasswordStatus ] = useState(false)
    const signUp = (e) => {
        e.preventDefault();
        // auth
        auth.createUserWithEmailAndPassword(
            emailRef.current.value,
            passwordRef.current.value
        ).then((authUser) => {
            userDb.add({
                userId: authUser.user.uid,
                name: name,
                username: username,
                posts: [],
                followers: [],
                following: [],
                followRequests: []
            }).then(
                () => {
                    setSignedUp(true)
                }
            )
            
        }).catch((error) => {
            alert(error.message);
        });
        
    }

    return (
        <div className="page__content">
            <div className="form">
                <form onSubmit={signUp} className="signupForm">
                    <div className="signupForm__logo">
                        <img id="logo"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" />
                    </div>
                    <p id="signUp__text">Sign up to see photos and videos from your friends.</p>
                    <button id="facebook__login"><div id="facebook__login__btnContent">
                        <FacebookIcon style={{ fill: "white", background: "none", marginRight: "5px" }} />
                        Log in with Facebook</div>
                    </button>
                    <div className="or__separator">
                        <div className="line"></div>
                        <span className="or__text">OR</span>
                        <div className="line"></div>
                    </div>
                    <div className="input__fields">
                        <input ref={emailRef} type="text" placeholder="Mobile Number or Email" 
                            onChange={(e)=>{ if(e.target.value !== "") setEmailStatus(true); else setEmailStatus(false)}}/>
                        
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Full Name" />
                        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />
                        
                        <input ref={passwordRef} type="password" placeholder="Password" 
                            onChange={(e)=>{ if(e.target.value !== "") setPasswordStatus(true);else setPasswordStatus(false)}} />
                    </div>
                    <button id="signUp__button" className={(name && username && isEmailSet && isPasswordSet)?"active" : "inactive"}  >Sign Up</button>
                    <p id="tnc">By signing up, you agree to our <strong>Terms</strong> ,
                        <strong> Data Policy</strong> and
                        <strong> Cookies Policy</strong> .
                    </p>
                </form>
            </div>
            <div className="account__exists">
                <p id="link_to_login">Have an account? <Link to='/login'><span className="link_text" style={{ textDecoration: "none", color: "#0095f6" }}>Log in</span></Link></p>
            </div>
            {signedUp ?
                <Redirect to='/home' /> :
                ''
            }
        </div>
    )
}

export default SignUp
