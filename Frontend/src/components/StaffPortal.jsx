import React, { useEffect, useState } from 'react';
import API from '../api';
import './StaffPortal.css';

export default function StaffPortal(){
  const [payments, setPayments] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [msg, setMsg] = useState('');

  useEffect(()=>{ load(); }, []);
  async function load(){
    try {
      const res = await API.get('/admin/payments', {
  headers: { Authorization: "Bearer " + localStorage.getItem('token') }
});
      setPayments(res.data.payments);
    } catch (err){ console.error(err); setMsg('Failed to load payments'); }
  }

  const toggle = (id) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const verify = async (id) => {
    try {
await API.post(`/admin/payments/${id}/verify`, {}, {
  headers: { Authorization: "Bearer " + localStorage.getItem('token') }
});
      setMsg('Payment verified');
      load();
    } catch (err){ setMsg(err.response?.data?.error || 'Verify failed'); }
  };

  const submitAll = async () => {
    const ids = Array.from(selected);
    try {
      const res = await API.post('/admin/payments/submit', { paymentIds: ids }, {
  headers: { Authorization: "Bearer " + localStorage.getItem('token') }
});
      setMsg('Submit results: ' + JSON.stringify(res.data.results));
      setSelected(new Set());
      load();
    } catch (err){ setMsg(err.response?.data?.error || 'Submit failed'); }
  };

  return (
   <div className="staff-portal">
  <h2>International Payments Portal (Staff)</h2>

  {msg && <div className="msg">{msg}</div>}

  <table>
    <thead>
      <tr>
        <th></th>
        <th>Customer</th>
        <th>Amount</th>
        <th>Currency</th>
        <th>Beneficiary</th>
        <th>SWIFT</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {payments.length > 0 ? payments.map(p => (
       <tr key={p._id}>
  <td><input type="checkbox" checked={selected.has(p._id)} onChange={() => toggle(p._id)} /></td>
  <td>{p.user?._id || p.user} - {p.user?.fullName || 'N/A'}</td>
  <td>{p.amount}</td>
  <td>{p.currency}</td>
  <td>{p.beneficiaryAccount}</td>
  <td>{p.beneficiarySwift}</td>
  <td>{p.status}</td>
  <td>
    {p.status === 'pending' && (
      <button style={{ background: "#007bff", color: "#fff" }} onClick={() => verify(p._id)}>
        Verify
      </button>
    )}
    {p.status === 'verified' && <span>Ready ✅</span>}
    {p.status === 'submitted' && <span>Submitted 🚀</span>}
  </td>
</tr>


      )) : (
        <tr><td colSpan="8" align="center">No payments found</td></tr>
      )}
    </tbody>
  </table>

  <button className="submit" onClick={submitAll} disabled={selected.size === 0}>
    Submit to SWIFT
  </button>
</div>

  );
}
