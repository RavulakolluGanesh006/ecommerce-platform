import { useState } from "react";
import API from "../api";
import {  useNavigate } from "react-router-dom";

export default function Login(){
    const[form,setForm]=useState({email:'',password:''})
    const navigate = useNavigate();
const handleSubmit=async(e)=>{
    e.preventDefault();
    try
    {
    const res=await API.post('/auth/login', form);
    console.log(res)
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem('token',res.data.token);
    console.log(localStorage)
    alert('Login success!');
    navigate('/profile');
    }
    catch(err)
    {
        alert("not success")
    }
}
const handleChange=(e)=>{
    setForm({...form,[e.target.name]: e.target.value})
}
    return(
<form onSubmit={handleSubmit}>
    <input name="email" onChange={handleChange}/>
    <input name="password" onChange={handleChange}/>
    <button type="submit">LOGIN</button>
</form>
    )
}