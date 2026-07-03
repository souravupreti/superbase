import { useState } from "react";
import "./App.css";
import supabase from "./superbase/superbase";

function Auth({session, setSession    }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  
  async function signup() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      console.log(data);
      setSession(data.session);
      alert("Signup Successful!");
      setEmail("");
      setPassword("");
    }
  }


  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      console.log(data);
      setSession(data.session);
      alert("Login Successful!");
      setEmail("");
      setPassword("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (isSignup) {
      signup();
    } else {
      login();
    }
  }

  return (
    <div
      style={{
        width: "400px",
        margin: "50px auto",
        border: "1px solid #ccc",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
          }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>

      <br />

      <button
        onClick={() => setIsSignup(!isSignup)}
        style={{
          width: "100%",
          padding: "10px",
        }}
      >
        {isSignup
          ? "Already have an account? Login"
          : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
}

export default Auth;