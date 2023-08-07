const router = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');


router.get('/', (req, res) => {
    readFromFile('./db/db.json', 'utf-8').then(notes => res.json(JSON.parse(notes)));
})


router.delete('/:id', (req, res) => {
    readFromFile('./db/db.json', 'utf-8').then(notes => {
        const updatedNotes = JSON.parse(notes).filter(note => note.id !== req.params.id);
        writeToFile('./db/db.json', updatedNotes);
        res.send('Note deleted successfully');
    });
})


router.post('/', (req, res) => {
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


module.exports = router;