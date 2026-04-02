import React, { useState } from 'react';

const ProfilePage = ({ userProgress }) => {
  const [name, setName] = useState('Carla');
  const [email, setEmail] = useState('carla@example.com');
  const [message, setMessage] = useState('');

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setMessage('Perfil actualizado con éxito.');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div>
      <h1>Perfil</h1>
      <div className='card' style={{ marginBottom: '1rem' }}>
        <p>Progreso: {userProgress.progress}%</p>
        <p>Lección actual: {userProgress.currentLesson}</p>
      </div>
      <form className='card' onSubmit={handleSubmit} style={{ maxWidth: '480px' }}>
        <label>Nombre</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email</label>
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Contraseña nueva</label>
        <input type='password' placeholder='****************' />
        <button className='btn btn-primary' type='submit'>Actualizar perfil</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProfilePage;
