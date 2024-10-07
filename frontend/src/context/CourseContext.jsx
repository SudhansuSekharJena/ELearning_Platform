import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";

// Context object created...
const CourseContext = createContext();

export const CourseContextProvider = ({children}) =>{

  const [ courses, setCourses ] = useState([]);
  const [ error, setError ] = useState(null);
  const [ mycourses, setMycourses ] = useState([]);
  const [ course, setCourse ] = useState([]);

  // FETCH ALL COURSES
  async function fetchCourses(){
    try {
      // Courses fetched
      const { data } = await axios.get(`${server}/api/course/all`, {
        headers:{
          token: localStorage.getItem("token"),
        }
      });
      setCourses(data.courses);
      setError(null); // clear error on success
    } catch (error) {
      console.log(error);
      setError("Failed to fetch courses")
    }
  }

  // FETCH MY COURSES
  async function fetchMyCourses(){
    try {
      const { data } = await axios.get(`${server}/api/mycourses`, {
        headers:{
          token: localStorage.getItem("token"),
        }
        
      });

      setMycourses(data.courses);
      
    } catch (error) {
      console.log(error);
    }
  }


  async function fetchCourse(id){
    try {
      const { data } = await axios.get(`${server}/api/course/${id}`);
      setCourse(data.course);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchCourses();
    fetchMyCourses();
  }, []);


  return (
    <CourseContext.Provider
    value={{
      courses,
      fetchCourses,
      error,
      mycourses,
      setMycourses,
      fetchMyCourses,
      fetchCourse,
      course,
      }}
      >
      {children}
    </CourseContext.Provider>
  );
}

export const CourseData = () =>{
  return useContext(CourseContext);
};