const pool = require('../db') 

const getAllNotes = async (user_id) => {
    const result = await pool.query('SELECT * FROM notes WHERE user_id = $1', [user_id])
    return result.rows
}

const getNoteById = async (id) => {
    const result = await pool.query(`SELECT * FROM notes WHERE id = $1`, [id])
    return result.rows[0]
}

const createNote = async (title, content, user_id) => {
    const result = await pool.query(`INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *`, [title, content, user_id])
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