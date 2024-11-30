import { useState, useContext, useEffect } from 'react';
import styles from '../styles/Login.module.css';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      navigate('/notes');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    // console.log(resp);
    setError('wrong credential');
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-form']}>
        <h2>Login</h2>
        {error && <div className={styles['error-message']}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className={styles['input-group']}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles['input-group']}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className={styles['login-button']}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
