import React from 'react';
import "./dashboard.css";
import { CourseData } from '../../context/CourseContext';
import CourseCard from '../../components/coursecard/CourseCard';

const Dashboard = () => {

  const { mycourses } = CourseData();
  console.log(mycourses)
  return (
    <div className='student-dashboard'>
      <h2>Enrolled Courses</h2>
      <div className="dashboard-content">
        {
          mycourses && mycourses.length > 0 ? (
            mycourses.map((e)=>(
              <CourseCard key={e._id} course={e}/>
            ))
          ) : (<p>No course Enrolled Yet</p>)
          
        }
      </div>
    </div>
  )
}

export default Dashboard
