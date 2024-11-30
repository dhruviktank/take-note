import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextEditor from '../components/TextEditor';
import API from '../utils/api';
import styles from '../styles/NoteView.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const NoteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get(`/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNote(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load note.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await API.put(
        `/notes/${id}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNote((prevState) => ({
        ...prevState,
        content: editedContent,
      }));
      setIsEditMode(false);

      // Show success toast
      toast.success('Note updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update note.');
    }
  };

  return (
    <div className={styles.noteViewPage}>
      {/* Toast Notification */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      {/* Left Sidebar */}
      <aside className={styles.leftSidebar}>
        <button onClick={() => navigate('/')} title="Home">
          🏠
        </button>
        <button onClick={() => navigate('/notes')} title="All Notes">
          📜
        </button>
        <button onClick={() => navigate('/notes/new')} title="Create Note">
          ✍️
        </button>
      </aside>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <button className={styles.backButton} onClick={() => navigate('/notes')}>
              &larr; Back
            </button>
            <h1 className={styles.headerTitle}>
              {isLoading ? 'Loading...' : note ? note.title : 'Note Not Found'}
            </h1>
          </div>
          <button className={styles.editButton} onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? 'Cancel' : 'Edit'}
          </button>
        </header>

        <div className={styles.noteContainer}>
          {isLoading ? (
            <p className={styles.loadingText}>Loading your note...</p>
          ) : note ? (
            isEditMode ? (
              <TextEditor value={note.content} onChange={setEditedContent} />
            ) : (
              <div
                className={styles.noteContent}
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            )
          ) : (
            <p className={styles.errorText}>Oops! Note not found.</p>
          )}
        </div>
        {/* Save Edit Button */}
        {isEditMode && (
          <div className={styles.saveButtonContainer}>
            <button className={styles.saveButton} onClick={handleSaveEdit}>
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Right Metadata */}
      {!isLoading && note && (
        <aside className={styles.metadata}>
          <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(note.updatedAt).toLocaleString()}</p>
        </aside>
      )}
    </div>
  );
};

export default NoteView;
