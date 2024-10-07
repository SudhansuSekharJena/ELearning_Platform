import React, { useEffect } from "react";
import "./courseDescription.css";
import { useParams, useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";


const CourseDescription = ({ user }) => {
  const navigate = useNavigate();
  const params = useParams();
  const { fetchCourse, course, fetchMyCourses } = CourseData();
  const { btnLoading, setBtnLoading } = UserData();

  useEffect(() => {
    fetchCourse(params.id);
  }, []);
  
  const checkoutHandler = async () => {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/course/checkout/${params.id}`, {}, {
        headers:{token: localStorage.getItem("token"),
      },
      });
      toast.success(data.message);
      setBtnLoading(false);
      fetchMyCourses(); // fetch courses of the User.id
      navigate(`/payment-success/${params.id}`);

    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response.data.message);
    }
  }

  return (
    <>
      {course && (
        <div className="course-description">
          <div className="course-header">
            <img
              src={`${server}/${course.image}`}
              alt=""
              className="course-image"
            />
          </div>
          <div className="course-info">
            <h2>{course.title}</h2>
            <p>Instructor:- {course.createdBy}</p>
            <p>Duration:- {course.duration}</p>
          </div>
          <p>{course.description}</p>
          <p>Let's get started with course At Rs. {course.price} </p>

          {user && user.subscription.includes(course._id) ? (
            <button onClick={()=>{
              navigate(`/course/study/${course._id}`)
            }}className="common-btn"> Study</button>
          ) : (
            <button onClick = {checkoutHandler} disabled={btnLoading} className="common-btn"> {btnLoading ? "Subscribing..." : "Buy Now"} </button>
          )}
        </div>
      )}
    </>
  );
};

export default CourseDescription;
