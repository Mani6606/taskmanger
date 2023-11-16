import React, { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import classes from "./signup.module.css";

function Header(props) {
  return (
    <>
      <div className={classes.header}>
        <h1>Welcome!</h1>
      </div>
      {props.children}
    </>
  );
}
export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confrimpassword, setConfrimpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordcheck, setPasswordcheck] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordcon, setShowPasswordcon] = useState(false);
  const togglePasswordVisibility = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibilitycon = (event) => {
    event.preventDefault();
    setShowPasswordcon(!showPasswordcon);
  };
  const inputTypecon = showPasswordcon ? "text" : "password";
  const inputType = showPassword ? "text" : "password";

  function Email() {
    setEmail("");
  }
  function Password() {
    setPassword("");
    setConfrimpassword("");
  }
  useEffect(() => {
    setEmailError(""), setPasswordError(""), setPasswordcheck("");
  }, [email, password, confrimpassword]);
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPassword(password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  function isMatching(password, confrimpassword) {
    return password === confrimpassword;
  }

  async function handleSignUp() {
    setEmailError("");
    setPasswordError("");
    setPasswordcheck("");
    setLoading(true);

    if (!isValidEmail(email)) {
      setEmailError("Invalid email address");
      console.log("email", !isValidEmail(email));

      setTimeout(Email, 600);
    }

    if (!isValidPassword(password)) {
      setPasswordError("Invalid password");
      console.log("password", !isValidPassword(password));

      setTimeout(Password, 600);
    }

    if (!isMatching(password, confrimpassword)) {
      setPasswordcheck("password Mismatch");
      setTimeout(Password, 600);
    }

    if (
      !isValidEmail(email) ||
      !isValidPassword(password) ||
      !isMatching(password, confrimpassword)
    ) {
      setLoading(false);
      return;
    } else {
      const responce = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const jsonData = await responce.json();
      if (responce.ok) {
        console.log(jsonData.msg);
        const response = await signIn("credentials", {
          redirect: false,
          Email: email,
          Password: password,
        });

        router.replace("/home");
      } else {
        console.log(jsonData.msg);
        console.log("faied");
        alert("The email is already used");
        setEmail("");
        setPassword("");
        setConfrimpassword("");
        setLoading(false);
      }
    }
    setLoading(false);
  }
  useEffect(() => {
    // Wrap the code in a "DOMContentLoaded" event listener
    document.addEventListener("DOMContentLoaded", function () {
      const signupForm = document.querySelector(".signupform");
      if (signupForm) {
        signupForm.classList.add("animate");
      }
    });
  }, []);
  return (
    <Header>
      <div className={classes.signupcontainer}>
        <div className={classes.signupform}>
          <h1>Sign Up</h1>

          <form>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Email id "
                onChange={(e) => setEmail(e.target.value)}
                required
                className={classes.signupinput}
              />
              <div className={classes.error}>{emailError}</div>
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type={inputType}
                id="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className={classes.signupinput}
              />
              <button
                className={classes.visiblebutton}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
              <div className={classes.error}>{passwordError}</div>
              <label htmlFor="password">Confrim Password</label>
              <input
                type={inputTypecon}
                id="confrimpassword"
                value={confrimpassword}
                placeholder="confrim password"
                onChange={(e) => setConfrimpassword(e.target.value)}
                required
                className={classes.signupinput}
              />
              <button
                className={classes.visiblebutton}
                onClick={togglePasswordVisibilitycon}
              >
                {showPasswordcon ? <FiEye /> : <FiEyeOff />}
              </button>
              <div className={classes.error}>{passwordcheck}</div>
            </div>

            <center>
              <button
                type="button"
                onClick={handleSignUp}
                className={classes.signupbutton}
              >
                {loading ? "Signing in..." : "Sign Up"}
              </button>
            </center>
            <div className={classes.loginoption}>
              <h4>Already having an account </h4>
              <Link href="/">SignIn</Link>
            </div>
          </form>
        </div>
      </div>
    </Header>
  );
}
