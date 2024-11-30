import './styles/_global.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import NewNote from './pages/NewNote';
import NoteView from './pages/NoteView';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
          <Route path="/notes/new" element={<PrivateRoute><NewNote /></PrivateRoute>} />
          <Route path="/notes/edit/:id" element={<PrivateRoute><NewNote /></PrivateRoute>} />
          <Route path="/notes/:id" element={<NoteView />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
