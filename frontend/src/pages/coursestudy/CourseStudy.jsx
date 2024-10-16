import React, { useEffect } from "react";
import "./courseStudy.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import { UserData } from "../../context/UserContext";

const CourseStudy = ({ user }) => {
  const navigate = useNavigate()
  const params = useParams();
  const { fetchCourse, course } = CourseData();
  const { btnLoading, setBtnLoading } = UserData();

  useEffect(() => {
    fetchCourse(params.id);
  });

  // if user is not admin and the user deosnot includes the course then return to home page.
  if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
    return navigate("/");
  }


  return (
    <>
      {course && (
        <div className="course-study-page">
          <img src={`${server}/${course.image}`} alt="" width={350}></img>
          <h2>{course.title}</h2>
          <h4>{course.description}</h4>
          <h5>by - {course.createdBy}</h5>
          <h5>Duration - {course.duration} weeks</h5>
          <div onClick={()=>{
            navigate(`/lectures/${course._id}`)
          }}className="common-btn">Lectures</div>
        </div>
      )}
    </>
  );
};

export default CourseStudy;
