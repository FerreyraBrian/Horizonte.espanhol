import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Por favor completa todos los campos.');
      return;
    }
    setMessage('Ingreso simulado correctamente.');
    setTimeout(() => navigate('/dashboard'), 600);
  };

  return (
    <div className='card' style={{ maxWidth: '480px', margin: '0 auto' }}>
      <h1>Iniciar sesión</h1>
      <form onSubmit={onSubmit}>
        <label>Correo electrónico</label>
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Contraseña</label>
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className='btn btn-primary' type='submit'>Ingresar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
