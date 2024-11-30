import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Assume AuthContext provides user state
import { useNavigate } from 'react-router-dom';
import styles from './../styles//HomePage.module.css'; // Using CSS Modules

const HomePage = () => {
  const { user } = useContext(AuthContext); // Access user context
  const navigate = useNavigate();

  return (
    <div className={styles.homepage}>
      {/* For Logged-Out Users */}
      {!user ? (
        <div className={styles.heroSection}>
          <h1>Welcome to NoteEase</h1>
          <p>Organize, store, and access your notes effortlessly, anytime and anywhere.</p>
          <div className={styles.ctaButtons}>
            <button onClick={() => navigate('/login')} className={styles.btnPrimary}>
              Login
            </button>
            <button onClick={() => navigate('/register')} className={styles.btnSecondary}>
              Register
            </button>
          </div>
        </div>
      ) : (
        // For Logged-In Users
        <div className={styles.dashboardSection}>
          <h1>Welcome back, {user.name || user.email}!</h1>
          <p>Here are some quick links to get you started:</p>
          <div className={styles.quickLinks}>
            <button onClick={() => navigate('/notes')} className={styles.btnPrimary}>
              View My Notes
            </button>
            <button onClick={() => navigate('/notes/new')} className={styles.btnSecondary}>
              Create a New Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
