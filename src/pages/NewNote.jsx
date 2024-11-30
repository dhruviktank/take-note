import TextEditor from '../components/TextEditor';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../utils/api';
import styles from '../styles/NewNote.module.css';

const NewNote = () => {
    const { id } = useParams(); // Get note ID from URL params if editing
    const navigate = useNavigate();

    const [note, setNote] = useState({ title: '', content: '' });
    const [tagInput, setTagInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch existing note if editing
    useEffect(() => {
        if (id) {
            const fetchNote = async () => {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                try {
                    const res = await API.get(`/notes/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setNote({
                        title: res.data.title || '',
                        content: res.data.content || '',
                        tags: res.data.tags || [], // Default to an empty array
                    });
                } catch (err) {
                    console.error(err);
                    alert('Failed to load note.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchNote();
        }
    }, [id]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setNote((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const setContent = (content) => {
        setNote((prevState) => ({
            ...prevState,
            content: content,
        }));
    };
    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    // Add new tag
    const addTag = (e) => {
        e.preventDefault();
        if (tagInput.trim() && !note.tags?.includes(tagInput)) {
            setNote((prevNote) => ({
                ...prevNote,
                tags: [...(prevNote.tags || []), tagInput.trim()], // Ensure tags is always an array
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setNote((prevNote) => ({
            ...prevNote,
            tags: prevNote.tags?.filter((tag) => tag !== tagToRemove) || [], // Ensure tags is always an array
        }));
    };


    // Save or Update Note
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            if (id) {
                // Update existing note
                await API.put(`/notes/${id}`, note, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Note updated successfully!');
            } else {
                // Create new note
                await API.post('/notes/new', note, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Note created successfully!');
            }
            navigate('/notes'); // Redirect to notes list
        } catch (err) {
            console.error(err);
            alert('Failed to save note.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.newNotePage}>
            {/* Header */}
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate('/notes')}>
                    &larr; Back
                </button>
                <h1>{id ? 'Edit Note' : 'New Note'}</h1>
            </header>

            {/* Form */}
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={note.title} // Controlled component
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Content</label>
                    <TextEditor value={note.content} onChange={setContent} />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="tags">Tags</label>
                    <div className={styles.tagContainer}>
                        {note.tags?.map((tag, index) => (
                            <div key={index} className={styles.tag}>
                                {tag}
                                <span className={styles.tagRemove} onClick={() => removeTag(tag)}>
                                    &times;
                                </span>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && addTag(e)}
                        placeholder="Add a tag and press Enter"
                        className={styles.tagInput}
                    />
                </div>

                <button type="submit" className={styles.saveButton} disabled={isLoading}>
                    {isLoading ? 'Saving...' : id ? 'Update Note' : 'Create Note'}
                </button>
            </form>
        </div>
    );
};

export default NewNote;
