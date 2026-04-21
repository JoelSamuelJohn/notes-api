const pool = require('../db') 

const getAllNotes = async () => {
    const result = await pool.query('SELECT * FROM notes')
    return result.rows
}

const getNoteById = async (id) => {
    const result = await pool.query(`SELECT * FROM notes WHERE id = $1`, [id])
    return result.rows[0]
}

const createNote = async (title, content) => {
    const result = await pool.query(`INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *`, [title, content])
    return result.rows[0]
}

const updateNote = async (title, content, id) => {
    const result = await pool.query(`UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *`, [title, content, id])
    return result.rows[0]
}

const deleteNote = async (id) => {
    const result = await pool.query(`DELETE FROM notes WHERE id = $1 RETURNING *`, [id])
    return result.rows[0]
}



module.exports = { getAllNotes, getNoteById, createNote, updateNote, deleteNote };