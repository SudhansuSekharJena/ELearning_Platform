import React, { useState } from "react";
import "./admincourses.css";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";

const AdminCourses = ({ user }) => {
  const navigate = useNavigate();
  const { courses, fetchCourses } = CourseData();

  if (user && user.role !== "admin") {
    navigate("/");
  }

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const categories = [
    "Web Development",
    "App Development",
    "Game Development",
    "Data Science",
    "Artificial Intelligence",
  ];

  const changeImageHandler = (e) => {
    // file contains the real-media
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file); // gives result

    // reader.result --> imagePrev
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  // Handler to create a new course by admin.
  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      console.log(data);

      toast.success(data.message);
      setBtnLoading(false);
      setImage("");
      setTitle("");
      setDescription("");
      setImagePrev("");
      setCreatedBy("");
      setPrice("");
      setCategory("");
      await fetchCourses();
    } catch (error) {
      setBtnLoading(false);
      if (error.response) {
        // If the error has a response object, show the message
        toast.error(error?.response?.data?.message || "Something went wrong");
      } else {
        // Otherwise, handle other errors (like network errors)
        toast.error("An error occurred. Please try again later.");
        console.error("Error:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="admin-courses">
        <div className="left">
          <h1>All Courses</h1>
          <div className="dashboard-content">
            {courses && courses.length > 0 ? (
              courses.map((e) => <CourseCard key={e._id} course={e} />)
            ) : (
              <p>No Courses</p>
            )}
          </div>
        </div>

        <div className="right">
          <div className="add-course">
            <div className="course-form">
              <h2>Add Course</h2>
              <form onSubmit={submitHandler}>
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <label htmlFor="description">Description</label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />

                <label htmlFor="createdBy">Created By</label>
                <input
                  id="createdBy"
                  type="text"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  required
                />
                <label htmlFor="selectCategory">Select your Course Category</label>
                <select
                  id="selectCategory"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value={""}> Select Category</option>
                  {categories.map((e) => (
                    <option value={e} key={e}>
                      {e}
                    </option>
                  ))}
                </select>

                <label htmlFor="duration">Duration</label>
                <input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
                <label htmlFor="thumbnail">Add thumbnail</label>
                <input id="thumbnail" type="file" onChange={changeImageHandler} required />

                {imagePrev && <img src={imagePrev} width={300} required />}

                <button
                  type="submit"
                  disabled={btnLoading}
                  className="common-btn"
                >
                  {btnLoading ? "Please Wait..." : "Add"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminCourses;
