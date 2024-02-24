import React from "react";

import{ createClient }  from '@supabase/supabase-js'
const supabaseUrl = 'https://snqmybgrurossgixkuyg.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucW15YmdydXJvc3NnaXhrdXlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5OTYxNDg1OSwiZXhwIjoyMDE1MTkwODU5fQ.UZg22z-osvKL5Yoq7hX8-allaO70bKx98g36VRoxGXY"
const supabase = createClient(supabaseUrl, supabaseKey)

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut ,signUp};

// ###########################################################

async function loginUser(dispatch, email, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);
  let { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })
  console.log(data)
  
  if(error)
  {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
   setIsLoading(false);
   return
  }
  localStorage.setItem('id_token', 1)
         setError(null)
        setIsLoading(false)
        dispatch({ type: 'LOGIN_SUCCESS' })



  // if (!!login && !!password) {
  //   setTimeout(() => {
  //     localStorage.setItem('id_token', 1)
  //     setError(null)
  //     setIsLoading(false)
  //     dispatch({ type: 'LOGIN_SUCCESS' })

  //     history.push('/app/dashboard')
  //   }, 2000);
  // } else {
  //   dispatch({ type: "LOGIN_FAILURE" });
  //   setError(true);
  //   setIsLoading(false);
  // }
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}

async function signUp(dispatch, email, password, history, setIsLoading, setError){

  setError(false);
  setIsLoading(true);
  
let { data, error } = await supabase.auth.signUp({
  email: email,
  password: password
})
console.log(data)

if(error)
{
  dispatch({ type: "LOGIN_FAILURE" });
  setError(true);
 setIsLoading(false);
 return
}
localStorage.setItem('id_token', 1)
       setError(null)
      setIsLoading(false)
      dispatch({ type: 'LOGIN_SUCCESS' })
}