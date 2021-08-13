import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import FacebookIcon from '@material-ui/icons/Facebook';
import './Login.css'
function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()

    const logIn = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(
            emailRef.current.value,
            passwordRef.current.value
        )
            .catch((error) => alert(error.message))
    }
    return (
        <div className="page__content">
            <div className="form">
                <form className="loginForm">
                    <div className="signupForm__logo">
                        <img id="logo"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png" alt="" />
                    </div>

                    <div className="input__fields">
                        <input ref={emailRef} type="text" placeholder="Phone Number, username or email" />
                        <input ref={passwordRef} type="password" placeholder="Password" />
                    </div>
                    <button id="signUp__button" onClick={(e) => logIn(e)}>Log In</button>
                    <div className="or__separator">
                        <div className="line"></div>
                        <span className="or__text">OR</span>
                        <div className="line"></div>
                    </div>
                    <button id="facebook__login_1"><div id="facebook__login__btnContent">
                        <FacebookIcon style={{ background: "none", marginRight: "5px" }} />
                        Log in with Facebook</div>
                    </button>
                </form>
            </div>
            <div className="account__exists">
                <p id="link_to_login">Don't have an account? <Link to='/'><span className="link_text">Sign up</span></Link></p>
            </div>
        </div>
    )
}

export default Login
