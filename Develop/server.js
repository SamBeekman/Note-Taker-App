const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend, writeToFile } = require('./helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// Import the feedback router
// const api = require('./routes/index.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve up static assets from the public folder
app.use(express.static('public'));

// Send all the requests that begin with /api to the index.js in the routes folder
// app.use('/api', api);

// This view route is a GET route for the homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// This view route is a GET route for the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json', 'utf-8').then(notes => res.json(JSON.parse(notes)));
})

app.delete('/api/notes/:id', (req, res) => {
    readFromFile('./db/db.json', 'utf-8').then(notes => {
        const updatedNotes = JSON.parse(notes).filter(note => note.id !== req.params.id);
        writeToFile('./db/db.json', updatedNotes);
        res.send('Note deleted successfully');
    });
})



app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };

        readAndAppend(newNote, './db/db.json');
        res.send('Note added successfully');
    } else {
        res.error('Error in adding note');
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`));