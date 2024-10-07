import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";

// useContext --> sending data from parent component directly to child component. this is done by using useContext()
// create, provider, useContext
const UserContext = createContext(); // context object created

export const UserContextProvider = ({ children }) => {
  // Store about the logging-user
  const [user, setUser] = useState([]);

  // This stats manages whether the user is authenticated(logged in) or not
  const [isAuth, setIsAuth] = useState(false);

  //manages the loading state of submit button
  const [btnLoading, setBtnLoading] = useState(false);

  // Loding default true
  const [loading, setLoading] = useState(true);

  // LOGIN USER
  async function loginUser(email, password, navigate, fetchMyCourses) {
    // btnloading set to true, login going on
    setBtnLoading(true);
    try {
      // in login we get email and password
      // server http://localhost:5000

      // the returned data after login goes to data object.
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);

      navigate("/"); // Navigate to home page
      fetchMyCourses();
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      toast.error(error.response.data.message);
    }
  }

  // REGISTER USER
  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      // in login we get email and password
      // server http://localhost:5000

      // the returned data after registration goes to data object.
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      setBtnLoading(false);
      navigate("/verify"); // Navigate to home page
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response.data.message);
    }
  }

  // VERIFY USER USING OTP AND AUTHENTICATION TOKEN
  async function verifyOtp(otp, navigate){
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken: localStorage.getItem("activationToken")
      });      
      toast.success(data.message);
      localStorage.clear();
      setBtnLoading(false);
      navigate("/login");
      // After verification no need of token
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response.data.message);

    }
  }



  // fetch profile of the user
  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      // if you get the data we can say user
      setIsAuth(true);
      setUser(data.user);
      setLoading(false); // user mila to loading close
    } catch (error) {
      setLoading(false); // if got error loading closes
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setIsAuth,
        isAuth,
        loginUser,
        btnLoading,
        setBtnLoading,
        loading,
        registerUser,
        verifyOtp,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => {
  return useContext(UserContext);
};
