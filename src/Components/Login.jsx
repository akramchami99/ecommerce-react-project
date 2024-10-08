import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Invalid username or password');
      }
      return res.json();
    })
    .then(data => {
      if (data.token) {
        fetch(`https://fakestoreapi.com/users`)
          .then(res => res.json())
          .then(users => {
            const user = users.find(u => u.username === username);
            loginUser({ id: user.id, username: user.name.firstname}, data.token);
            navigate('/');
          });
      } else {
        setError('Invalid username or password');
      }
    })
    .catch(err => setError(err.message));
  };

  return (
    <div className='login-main'>
      <div className='login-form'>
        <h1>Login</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
