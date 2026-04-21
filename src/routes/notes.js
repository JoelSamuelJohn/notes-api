const express = require('express');
const router = express.Router();

const { getAllNotes, getNoteById, createNote, updateNote, deleteNote } = require('../queries/notes');

// GET all notes
router.get('/', async (req, res) => {
  try {
    const notes = await getAllNotes()
    res.json(notes)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single note
router.get('/:id', async (req, res) => {
  try {
    const note = await getNoteById(req.params.id)
    if (!note) return res.status(404).json({ error: 'note not found' })
    res.json(note)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  if (!req.body.title || req.body.title.trim() === "") {
    return res.status(400).json({ error: "title is required" })
  }
  try {
    const note = await createNote(req.body.title, req.body.content)
    res.json(note)

  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
})

router.put('/:id', async (req, res) => {
  if (!req.body.title || req.body.title.trim() === "") {
    return res.status(400).json({ error: "title is required" })
  }
  try {
    const note = await updateNote(req.params.id, req.body.title, req.body.content)
    if (!note) return res.status(404).json({ error: 'note not found' })
    res.json(note)
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const note = await deleteNote(req.params.id)
    if (!note) return res.status(404).json({ error: 'note not found' })
    res.json(note)
  }
  catch (err) {
    res.status(500).json({ error: err.message })
  }
})


module.exports = router;