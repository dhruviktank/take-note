import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import AuthContext from '../context/AuthContext';
import styles from '../styles/Notes.module.css';
// import DOMPurify from 'dompurify';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const notesPerPage = 5; // Number of notes per page
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/notes', { headers: { Authorization: `Bearer ${token}` } });
      setNotes(res.data);

      // Extract unique tags from notes
      const allTags = res.data.flatMap((note) => note.tags || []);
      setTags([...new Set(allTags)]);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const onNewNote = () => navigate('/notes/new');
  const onViewNote = (noteId) => navigate(`/notes/${noteId}`);
  const onEditNote = (noteId) => navigate(`/notes/edit/${noteId}`);

  // Filter Notes
  const filteredNotes = notes.filter((note) => {
    const matchesTitle = note.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every((tag) => note.tags?.includes(tag));
    return matchesTitle && matchesTags;
  });

  // Pagination logic
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle tag selection
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
  // const cleanContent = (html) => {
  //   const tempElement = document.createElement('div');
  //   tempElement.innerHTML = DOMPurify.sanitize(html); // Sanitize HTML
  //   return tempElement.textContent || tempElement.innerText || ''; // Extract plain text
  // };

  return (
    <div className={styles.notePage}>
      {/* Header */}
      <header className={styles.noteHeader}>
        <div className={styles.profileSection}>
          <img
            src="https://via.placeholder.com/40"
            alt="User Profile"
            className={styles.profileIcon}
          />
          <span className={styles.userName}>{user.name}</span>
        </div>
        <button className={styles.newNoteButton} onClick={onNewNote}>
          + New Note
        </button>
      </header>

      {/* Main Content */}
      {
        <div className={styles.mainContent}>
          {/* Filters Section */}
          <aside className={styles.filtersSection}>
            <h3>Filters</h3>

            {/* Title Filter */}
            <div className={styles.titleFilter}>
              <label>Search by Title:</label>
              <input
                type="text"
                placeholder="Search notes..."
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
                className={styles.filterInput}
              />
            </div>

            {/* Tag Filter */}
            {
              loading ? (
                <div className={styles.spinner}></div>
              ) : (
                <div className={styles.tagFilter}>
                  <label>Select Tags:</label>
                  <div className={styles.tagCheckboxContainer}>
                    {tags.map((tag) => (
                      <label key={tag} className={styles.tagCheckbox}>
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                        />
                        {tag}
                      </label>
                    ))}
                  </div>
                </div>
              )
            }

            {/* Display Selected Tags */}
            {selectedTags.length > 0 && (
              <div className={styles.selectedTagsContainer}>
                <h4>Selected Filters:</h4>
                <div className={styles.selectedTags}>
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className={styles.selectedTag}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag} &times;
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Notes Section */}
          {
            loading ? (
              <div className={styles.spinner}></div>
            ) : (
              <section className={styles.notesSection}>
                <div className={styles.notesList}>
                  {!loading || currentNotes.length > 0 ? (
                    currentNotes.map((note) => (
                      <div key={note._id} className={styles.noteCard}>
                        <h3>{note.title}</h3>
                        {/* <p>{cleanContent(note.content).substring(0, 100)}...</p> */}
                        <div className={styles.tagsContainer}>
                          {note.tags.map((tag, index) => (
                            <span key={index} className={styles.tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className={styles.buttonGroup}>
                          <button
                            className={`${styles.actionButton} ${styles.editButton}`}
                            onClick={() => onEditNote(note._id)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className={`${styles.actionButton} ${styles.viewButton}`}
                            onClick={() => onViewNote(note._id)}
                          >
                            👁️ View
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.spinner}></div>
                  )}
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                  {Array.from(
                    { length: Math.ceil(filteredNotes.length / notesPerPage) },
                    (_, index) => (
                      <button
                        key={index}
                        className={`${styles.paginationButton} ${currentPage === index + 1 ? styles.active : ''
                          }`}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    )
                  )}
                </div>
              </section>
            )
          }
        </div>
      }
    </div>
  );
};

export default Notes;
