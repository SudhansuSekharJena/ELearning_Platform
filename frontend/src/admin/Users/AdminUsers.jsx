import React, { useEffect, useState } from 'react';
import "./adminusers.css";
import { useNavigate } from 'react-router-dom';
import { server } from '../../main';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../Utils/Layout';


const AdminUsers = ({ user }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [btnLoading, setBtnLoading] = useState(false);
  
  // if not admin go to home page
  if(user && user.role !== "admin"){
    navigate("/");
  }

  async function fetchUsers(){
    try {
     const { data } = await axios.get(`${server}/api/users`, {
      headers:{
        token: localStorage.getItem("token"),
      }
     });

     setUsers(data.users);
     toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function updateRole(user_id){
    if(confirm("Are you sure you want to update this user's role")){
      try {
        setBtnLoading(true);
        const { data } = await axios.put(`${server}/api/user/${user_id}`, {}, {
          headers:{
            token: localStorage.getItem("token"),
          }
        });
        toast.success("Role updated");
        setBtnLoading(false);
        await fetchUsers();
        
      } catch (error) {
        toast.error(error.response.data.message)
        setBtnLoading(false)
      }
    }
  }

  useEffect(()=>{
    fetchUsers();
  }, []);

  console.log(users);

  return (
    <Layout>
      <div className="users">
        <h1>All Users</h1>
        <table border={"black"}>
          <thead>
            <tr>
              <td>#</td>
              <td>name</td>
              <td>email</td>
              <td>role</td>
              <td>update role</td>
            </tr>
          </thead>

          {
            users && users.map((e, i)=>(
              <tbody key={e._id}>
                <tr>
                  <td>{i+1}</td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.role}</td>
                  <td>
                    <button disabled={btnLoading} onClick={()=>updateRole(e._id)} className="common-btn"> {btnLoading ? "Please wait..." : "Update Role"}</button>
                  </td>
                </tr>
              </tbody>
            ))
          }
        </table>
      </div>
    </Layout>
  )
}

export default AdminUsers
