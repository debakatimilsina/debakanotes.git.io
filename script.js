// Function to generate unique ID using date-time stamp and user number
function generateUniqueId(userNumber) {
    const now = new Date();
    
    // Format: YYYYMMDD-HHMMSS-milliseconds-userNumber
    const dateStr = now.getFullYear().toString() +
                   (now.getMonth() + 1).toString().padStart(2, '0') +
                   now.getDate().toString().padStart(2, '0');
    
    const timeStr = now.getHours().toString().padStart(2, '0') +
                   now.getMinutes().toString().padStart(2, '0') +
                   now.getSeconds().toString().padStart(2, '0');
    
    const millisStr = now.getMilliseconds().toString().padStart(3, '0');
    
    return `${dateStr}-${timeStr}-${millisStr}-${userNumber.padStart(4, '0')}`;
}

// Function to format date-time for display
function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
}

// Function to save notes to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('smartNotes', JSON.stringify(notes));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Function to load notes from localStorage
function loadFromLocalStorage() {
    try {
        const storedNotes = localStorage.getItem('smartNotes');
        return storedNotes ? JSON.parse(storedNotes) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

// Function to merge default and saved notes
function getMergedNotes() {
    const defaultNotes = [
        {
            id: '20241026-100000-000-0001',
            title: "Welcome to Smart Notes!",
            subtitle: "Getting Started Guide",
            content: "Click the + button to create a new note. You can edit, pin, and delete notes using the buttons below each note. Use the search bar to find specific notes.",
            created: "2024-10-26T10:00:00.000Z",
            lastModified: "2024-10-26T10:00:00.000Z",
            category: "General",
            tags: ["welcome", "guide"],
            pinned: true
        },
        {
            id: '20241026-100100-000-0002',
            title: "Important Features",
            subtitle: "What's New",
            content: "1. Colorful note cards\n2. Search functionality\n3. Copy data feature\n4. Pin important notes\n5. Edit and delete options",
            created: "2024-10-26T10:01:00.000Z",
            lastModified: "2024-10-26T10:01:00.000Z",
            category: "Features",
            tags: ["features", "new"],
            pinned: false
        },
{
  "id": "20241026-170956-179-0003",
  "title": "constitution",
  "subtitle": "judicial review",
  "content": "judicial review of legislation is brain child of judiciary",
  "created": "2024-10-26T11:24:56.179Z",
  "lastModified": "2024-10-26T11:24:56.179Z",
  "category": "General",
  "tags": [
    "constitution"
  ],
  "pinned": false
}
    ];

    const savedNotes = loadFromLocalStorage() || [];
    const existingIds = new Set(defaultNotes.map(note => note.id));
    const uniqueSavedNotes = savedNotes.filter(note => !existingIds.has(note.id));

    return [...defaultNotes, ...uniqueSavedNotes];
}

// Initialize notes array
let notes = getMergedNotes();

// Copy data functionality
function copyData() {
    const dataText = document.getElementById('dataPreview').textContent;
    navigator.clipboard.writeText(dataText).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    renderNotes(searchTerm);
});

function generateData(userNumber, title, subtitle, content) {
    return {
        id: generateUniqueId(userNumber),
        title,
        subtitle,
        content,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        category: "General",
        tags: title.toLowerCase().split(' '),
        pinned: false
    };
}

function updateDataPreview() {
    const userNumber = document.getElementById('noteNumber').value;
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const content = document.getElementById('content').value;
    const data = generateData(userNumber, title, subtitle, content);
    document.getElementById('dataPreview').textContent = JSON.stringify(data, null, 2);
}

function showForm(editId = null) {
    // Prevent editing of default notes
    if (editId === '20241026-100000-000-0001' || editId === '20241026-100100-000-0002') {
        alert('Default notes cannot be edited.');
        return;
    }

    document.getElementById('formSection').style.display = 'block';
    document.getElementById('formTitle').textContent = editId ? 'Edit Note' : 'Add New Note';
    
    if (editId) {
        const note = notes.find(n => n.id === editId);
        document.getElementById('editingId').value = editId;
        document.getElementById('noteNumber').value = note.id.split('-')[3];
        document.getElementById('noteNumber').disabled = true;
        document.getElementById('title').value = note.title;
        document.getElementById('subtitle').value = note.subtitle;
        document.getElementById('content').value = note.content;
        updateDataPreview();
    } else {
        document.getElementById('noteNumber').disabled = false;
        document.getElementById('noteNumber').value = '';
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideForm() {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('noteForm').reset();
    document.getElementById('editingId').value = '';
    document.getElementById('dataPreview').textContent = '';
    document.getElementById('noteNumber').disabled = false;
}

// Note number input validation
document.getElementById('noteNumber').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
    
    if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
    }
    
    if (/^\d{4}$/.test(this.value)) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
    } else {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
    }
});

['noteNumber', 'title', 'subtitle', 'content'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateDataPreview);
});

// Form submission handler
document.getElementById('noteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userNumber = document.getElementById('noteNumber').value.trim();
    const title = document.getElementById('title').value.trim();
    const subtitle = document.getElementById('subtitle').value.trim();
    const content = document.getElementById('content').value.trim();
    const editingId = document.getElementById('editingId').value;
    
    if (!/^\d{4}$/.test(userNumber)) {
        document.getElementById('noteNumber').classList.add('is-invalid');
        alert('Please enter a valid 4-digit number');
        return;
    }
    
    if (!editingId) {
        const idExists = notes.some(note => note.id.endsWith(userNumber.padStart(4, '0')));
        if (idExists) {
            document.getElementById('noteNumber').classList.add('is-invalid');
            alert('This number is already in use. Please choose a different number.');
            return;
        }
    }
    
    if (editingId) {
        const index = notes.findIndex(n => n.id === editingId);
        if (index !== -1) {
            notes[index] = {
                ...notes[index],
                title,
                subtitle,
                content,
                lastModified: new Date().toISOString()
            };
        }
    } else {
        const noteData = generateData(userNumber, title, subtitle, content);
        notes.push(noteData);
    }
    
    saveToLocalStorage();
    renderNotes();
    hideForm();
});

function togglePin(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        note.pinned = !note.pinned;
        saveToLocalStorage();
        renderNotes();
    }
}

function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function toggleContent(contentId, noteId) {
    const contentElement = document.getElementById(contentId);
    const note = notes.find(n => n.id === noteId);
    const isExpanded = contentElement.style.maxHeight === 'none';
    
    if (isExpanded) {
        contentElement.style.maxHeight = '100px';
        contentElement.innerHTML = `
            ${note.content.substring(0, 200)}...
            <span class="read-more" onclick="toggleContent('${contentId}', '${noteId}')">
                <i class="fas fa-ellipsis-h"></i>
            </span>
        `;
    } else {
        contentElement.style.maxHeight = 'none';
        contentElement.innerHTML = `
            ${note.content}
            <span class="read-more" onclick="toggleContent('${contentId}', '${noteId}')">
                <i class="fas fa-chevron-up"></i>
            </span>
        `;
    }
}

function deleteNote(id) {
    // Prevent deletion of default notes
    if (id === '20241026-100000-000-0001' || id === '20241026-100100-000-0002') {
        alert('Default notes cannot be deleted.');
        return;
    }

    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== id);
        saveToLocalStorage();
        renderNotes();
    }
}

function renderNotes(searchTerm = '') {
    const container = document.getElementById('notesContainer');
    container.innerHTML = '';
    
    let filteredNotes = notes;
    if (searchTerm) {
        filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) ||
            note.subtitle.toLowerCase().includes(searchTerm) ||
            note.content.toLowerCase().includes(searchTerm) ||
            note.id.toLowerCase().includes(searchTerm)
        );
    }
    
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.lastModified) - new Date(a.lastModified);
    });
    
    sortedNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'col-md-4 mb-4 note-card';
        
        const contentId = `content-${note.id}`;
        const isLongContent = note.content.length > 200;
        const truncatedContent = isLongContent ? 
            note.content.substring(0, 200) + '...' : 
            note.content;
        
        noteElement.innerHTML = `
            <div class="card h-100 ${note.pinned ? 'pinned' : ''}">
                <div class="card-body">
                    <div class="note-number mb-2 text-muted">
                        <small>Note #${note.id}</small>
                    </div>
                    <h5 class="card-title">${highlightText(note.title, searchTerm)}</h5>
                    <h6 class="card-subtitle mb-2 text-decoration-underline">${highlightText(note.subtitle, searchTerm)}</h6>
                    <div class="card-text ${isLongContent ? 'truncate-content' : ''}" id="${contentId}" style="color: black;">
                        ${highlightText(truncatedContent, searchTerm)}
                        ${isLongContent ? `
                            <span class="read-more" onclick="toggleContent('${contentId}', '${note.id}')">
                                <i class="fas fa-ellipsis-h"></i>
                            </span>
                        ` : ''}
                    </div>
                    <div class="note-timestamp mt-2">
                        <small class="text-opacity-75">
                            Created: ${formatDateTime(note.created)}
                        </small>
                    </div>
                </div>
                <div class="card-footer bg-transparent d-flex justify-content-end">
                    <button class="action-btn" title="Edit" onclick="showForm('${note.id}')">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="action-btn" title="${note.pinned ? 'Unpin' : 'Pin'}" onclick="togglePin('${note.id}')">
                        <i class="fas fa-thumbtack" style="${note.pinned ? 'transform: rotate(45deg);' : ''}"></i>
                    </button>
                    <button class="action-btn" title="Delete" onclick="deleteNote('${note.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(noteElement);
    });
}

//  initialization 
document.addEventListener('DOMContentLoaded', function() {
    // Hide form section on initial load
    document.getElementById('formSection').style.display = 'none';
    
    // Load and render notes
    notes = getMergedNotes();
    renderNotes();
});
