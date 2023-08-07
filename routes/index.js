const notesRouter = require('./notes');

const router = require('express').Router();

router.use('/notes', notesRouter);


module.exports = router;
