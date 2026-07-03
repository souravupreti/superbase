import { useEffect, useState } from "react";
import "./App.css";
import supabase from "./superbase/superbase.js";
import R from "./R.jsx";
import Auth from "./Auth.jsx";

function App() {
  const [session, setSession] = useState(null);

  // async function getSession() {
  //   const { data, error } = await supabase.auth.getSession();

  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log(data)
  //     setSession(data.session);
  //   }
  // }
  async function clearSession(){
    if(!session){
      alert("No session found");
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      setSession(null);
      alert("Logout Successful!");
    }

  }
  useEffect(() => {
    // getSession()
  }, [session]);
  return (
    <>{
      session?<button onClick={clearSession}> logout</button>:""
    }
      {session ? <R /> : <Auth session={session} setSession={setSession}/>}
    </>
  );
}

export default App;