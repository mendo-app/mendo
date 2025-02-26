import { useState } from "react";
import styles from "../styles/SignUpPage.module.css";
import authService from "../api/authService";
import {useNavigate} from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const [values, setValues] = useState({
        name: "name",
        email: "email",
        password: "password"
    }); 

    const handleChange = (e) => {
        setError(null)
        setValues({...values, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const form = e.target;
        const isValid = form.checkValidation();

        if (!isValid) {
            setError("Submission is invalid")
        }
        else {
            authService.signup(values.email, values.password)
            .then(() => {
                authService.login(values.email, values.password)
                .then(() => {
                    navigate("/")
                })
                .catch(() => {
                    if (error.status === 401) {
                        setError("invalid-credentials");
                    } else if (error.status === 500) {
                        setError("server-error");
                    } else if (error.status === 404) {
                        setError("connection-error");
                    }  
                })
            })
            .catch((error) => {
                if (error.status === 401) {
                    setError("invalid-credentials");
                  } else if (error.status === 500) {
                    setError("server-error");
                  } else if (error.status === 404) {
                    setError("connection-error");
                  }                
            })
        }
    }

    // I WILL CHANGE THIS TO FIT FOR SIGNUP 
    return <>
        <div className={styles.container}>
        <form onSubmit={handleSubmit}>
            <h1>Log in</h1>
            <p className={`${styles.invalid} ${error != "invalid-credentials" ? "hide": ""}`}>The email or password is incorrect</p>
            <p className={`${styles.invalid} ${error != "server-error" ? "hide": ""}`}>There is an issue with our servers</p>
            <p className={`${styles.invalid} ${error != "connection-error" ? "hide": ""}`}>Unable to connect to servers</p>
            <div className={styles.row}>
            <label htmlFor="email">Email</label>
            <input required className={`${styles.input} ${error ? styles.error: ""}`} onChange={handleChange} name="email" type="email"/>
            </div>
            <div className={styles.row}>
            <label htmlFor="password">Password</label>
            <input required className={`${styles.input} ${error ? styles.error: ""}`} onChange={handleChange} name="password" type="password"/>
            </div>
            <hr/>
            <div className={styles.actions}>
            <button className={styles.create}>Log in</button>
            <p className={`${styles.invalid} ${error != "invalid-form" ? "hide": ""}`}>Please provide a valid email and password</p>
            <p>No account? <Link to="/signup" className={styles.clickable}>Create One</Link></p>
            <Link to="/forgot" className={styles.clickable}>Forgot Password</Link>
            </div>
        </form>
        </div>
    </>;

}

export default SignUp;