import React, { useState } from 'react';
import API from '../api';
import './StaffLogin.css';
import { useNavigate } from 'react-router-dom';

export default function StaffLogin(){
  const [form, setForm] = useState({ email: '', password: ''});
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form); // ensure backend returns token + role
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      navigate('/staff/portal');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="staff-login">
      <h2>Staff Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={e=>setForm({...form, email:e.target.value})} required/>
        <input name="password" type="password" placeholder="Password" onChange={e=>setForm({...form, password:e.target.value})} required/>
        <button>Login</button>
      </form>
      {err && <p className="error">{err}</p>}
    </div>
  );
}
