
import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
export default function Register() {

    const[form,setForm]=useState({
        name:'',
        email:'',
        password:''
    })
    const navigate=useNavigate();
    const handleChange=(e)=>{
      setForm({...form,[e.target.name]:e.target.value});
    }

    const handleSubmit=async(e)=>{
      e.preventDefault();
      try{
        const res=await API.post(`/auth/register`,form)
          alert(res.data.message)
          navigate("/login")
          
      }catch(err){
          alert(err.response.data.message)
      }
    }
return(
    <div>
    <h1>REGISTER</h1>
    <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange}/>
        <input name="email" onChange={handleChange}/>
        <input name="password" onChange={handleChange}/>
        <button type="submit">Register</button>
    </form>
    </div>
)
}