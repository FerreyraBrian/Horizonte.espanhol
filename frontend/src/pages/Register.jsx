import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage('Rellena todos los campos.');
      return;
    }
    setMessage('Registro simulado exitoso.');
    setTimeout(() => navigate('/dashboard'), 600);
  };

  return (
    <div className='card' style={{ maxWidth: '480px', margin: '0 auto' }}>
      <h1>Registrarse</h1>
      <form onSubmit={onSubmit}>
        <label>Nombre</label>
        <input type='text' value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Correo electrónico</label>
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Contraseña</label>
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className='btn btn-primary' type='submit'>Crear cuenta</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
