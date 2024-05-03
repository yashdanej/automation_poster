import React, { useEffect, useState } from 'react';
import './login.css';
import SnackbarWithDecorators from '../../utils/SnackbarWithDecorators';
import { useNavigate } from 'react-router-dom';

const Login = ({user, setUser}) => {
    const [snackAlert, setSnackAlert] = useState(false); // popup success or error
    const [snackbarProperty, setSnackbarProperty] = useState({ // popup success or error text
        text: '',
        color: ''
    });
    const navigate = useNavigate();
    const changeText = (e, set, state) => {
        set({...state, [e.target.name]: e.target.value});
    }
    useEffect(() => {
        const is_logged = localStorage.getItem("poster_is_logged_in");
        if(is_logged){
            navigate('/poster');
        }
    })
    const onLogin = (e) => {
        e.preventDefault();
        console.log('user', user);
        if(user.username.trim() === "" || user.password === ""){
            setSnackbarProperty(prevState => ({
                ...prevState,
                text: "Username and password required!",
                color: "danger"
              }));
            setSnackAlert(true);
        }else{
            if(user.username === "myinvented" && user.password === "MyInvented123"){
                localStorage.setItem("poster_is_logged_in", true);
                navigate('/poster');
            }else{
                setSnackbarProperty(prevState => ({
                    ...prevState,
                    text: "Incorrect username or password!",
                    color: "danger"
                  }));
                setSnackAlert(true);
            }
        }
    }
  return (
    <div className="limiter">
        {
            snackAlert && <SnackbarWithDecorators snackAlert={snackAlert} setSnackAlert={setSnackAlert} text={snackbarProperty.text} color={snackbarProperty.color}  />
        }
    <div className="container-login100">
      <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">
        <form className="login100-form validate-form flex-sb flex-w">
          <span className="login100-form-title p-b-32">Account Login</span>
          <span className="txt1 p-b-11">Username</span>
          <div
            className="wrap-input100 validate-input m-b-36"
            data-validate="Username is required"
          >
            <input className="input100" type="text" name="username" onChange={(e) => {changeText(e, setUser, user)}} />
            <span className="focus-input100"></span>
          </div>
          <span className="txt1 p-b-11">Password</span>
          <div
            className="wrap-input100 validate-input m-b-12"
            data-validate="Password is required"
          >
            <span className="btn-show-pass">
              <i className="fa fa-eye"></i>
            </span>
            <input className="input100" type="password" name="password" onChange={(e) => {changeText(e, setUser, user)}}  />
            <span className="focus-input100"></span>
          </div>
          <div className="flex-sb-m w-full p-b-48">
            <div className="contact100-form-checkbox">
              <input
                className="input-checkbox100"
                id="ckb1"
                type="checkbox"
                name="remember-me"
              />
            </div>
          </div>
          <div className="container-login100-form-btn">
            <button onClick={onLogin} className="login100-form-btn">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}

export default Login
