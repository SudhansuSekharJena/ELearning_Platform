import React, { useEffect } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import { IoCloudDone } from "react-icons/io5";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState({});
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const params = useParams();
  // during add lectures we are taking title, description, video
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  // this will be used when we select a video it will show preview
  const [btnLoading, setBtnLoading] = useState(false);

  // if user and user is admin and user.subscription desnot includes the course_id then return to home
  if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
    return navigate("/");
  }

  async function fetchLectures() {
    try {
      const course_id = params.id;
      // ${server}/api/lectures/${course_id}
      const { data } = await axios.get(`${server}/api/lectures/${course_id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      console.log(data.lectures);
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      setLoading(false);
    }
  }

  async function fetchLecture(lecture_id) {
    setLecLoading(true);
    try {
      // ${server}/api/lecture/${lecture_id}
      const { data } = await axios.get(`${server}/api/lecture/${lecture_id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setLecture(data.lecture);
      setLecLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
      setLecLoading(false);
    }
  }

  const addProgram = async (lecture_id) => {
    console.log(`Lecture completed : ${lecture_id}`);
  };

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];

    // FileReader object is created to read files asunchronously that are stored in user's computer.
    const reader = new FileReader();
    // readAsDataURL reals the file as base64-encoded string and stores it.
    // base64 converts the bindary data of file into a base64 encoded string made up pf 64 characters(letters, digits and 2 characters). Generally used to read media files.
    reader.readAsDataURL(file);

    // After reading of the file by FileReader instance , onloadend event triggers regardless of success reading por failure reading.After the onloadend event triggers you can see the reading by reader.result or if error reader.error.
    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setVideo(file);
    };
  };
  // ADDING NEW LECTURE
  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    const myform = new FormData();

    myform.append("title", title);
    myform.append("description", description);
    myform.append("file", video);

    try {
      const course_id = params.id;
      const { data } = await axios.post(
        `${server}/api/course/lecture/${course_id}`,
        myform,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      toast.success(data.message);

      // Reset form state and close the form
      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setVideo("");
      setVideoPrev("");

      // Hide the form.
      setShow(false);

      // refetch lectures to update the list
      await fetchLectures();
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (lecture_id) => {
    if (confirm("Are you sure you are going to delete the lecture")) {
      try {
        const { data } = await axios.delete(
          `${server}/api/lecture/${lecture_id}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        toast.success(data.message);
        await fetchLectures();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };
  // How much % I have completed the course
  const [completed, setCompleted] = useState("");

  // How much lectures I have completed out of total
  const [completedLec, setCompletedLec] = useState("");

  // No of Lectures
  const [lecLength, setLecLength] = useState("");

  // progress contains the lecture object which are completed
  const [progress, setProgress] = useState([]);

  async function fetchProgress() {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${params.id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      setCompleted(data.courseProgressPercentage);
      setCompletedLec(data.completedLectures); 
      setLecLength(data.allLectures);
      setProgress(data.progress);
    } catch (error) {}
  }

  /*---*/
  const addProgress = async (lecture_id) => {
    try {
      const { data } = await axios.post(
        `${server}/api/user/progress?course=${params.id}&lectureId=${lecture_id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      console.log(data.message);
      await fetchProgress();
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    fetchLectures();
    fetchProgress();
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>

        <div className="progress">
          Lecture completed - {completedLec} out of {lecLength}
          <progress value={completed} max={100}></progress> {completed} %
        </div>
          <div className="lecture-page">
            <div className="left">
              {lecLoading ? (
                <Loading />
              ) : (
                <>
                  {lecture.video ? (
                    <>
                      <video
                        src={`${server}/${lecture.video}`}
                        width={"100%"}
                        controls
                        controlsList="nodownload noremoteplayback"
                        disablePictureInPicture
                        disableRemotePlayback
                        autoPlay
                        onEnded={() => addProgress(lecture._id)}
                      ></video>
                      <h1>{lecture.title}</h1>
                      <h3>{lecture.description}</h3>
                    </>
                  ) : (
                    <h1>Please Select a Lecture</h1>
                  )}
                </>
              )}
            </div>
            <div className="right">
              {/*if user is adming then this.. its only if case not if-else, for only { if case use:-  ___ && this } and { if u need if-else case then:- ___ ? this : that */}
              {user && user.role === "admin" && (
                <div className="common-btn" onClick={() => setShow(!show)}>
                  {show ? "Close" : "Add Lecture + "}
                </div>
              )}

              {/* When admin clicks Add lecture button, show flag which was false intially becomes true, then as show true then the form will be shown on the screen and the button text will be written close.*/}
              {show && (
                <div className="lecture-form">
                  <h2>Add Lecture</h2>
                  <form onSubmit={submitHandler}>
                    <label htmlFor="text">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />

                    <label htmlFor="text">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />

                    <input
                      type="file"
                      placeholder="choose video"
                      onChange={changeVideoHandler}
                      required
                    />

                    {
                      // FOR PREVIEW OF THE VIDEO
                      // if videoPreview is there show it
                      videoPrev && (
                        <video
                          src={videoPrev}
                          alt=""
                          width={300}
                          controls
                        ></video>
                      )
                    }

                    <button
                      disabled={btnLoading}
                      type="submit"
                      className="common-btn"
                    >
                      {btnLoading ? "Please wait..." : "Add"}
                    </button>
                  </form>
                </div>
              )}

              {lectures && lectures.length > 0 ? (
                lectures.map((e, i) => (
                  <React.Fragment key={e._id}>
                    <div
                      onClick={() => fetchLecture(e._id)}
                      className={`lecture-number ${
                        lecture._id === e._id && "active"
                      }`}
                    >
                      {i + 1}. {e.title} {progress && progress[0].completedLectures.includes(e._id) && <span sty><IoCloudDone/></span>}
                    </div>
                    {user && user.role === "admin" && (
                      <button
                        onClick={() => deleteHandler(e._id)}
                        className="common-btn"
                        style={{ background: "red" }}
                      >
                        Delete {e.title}
                      </button>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <p>No Lectures Yet</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Lecture;
