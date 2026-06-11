const pool = require('../db')

const createUser = async (name, email, password) => {
    const result = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`, [name, email, password])
    return result.rows[0]
}

const getUserByEmail = async (email) => {
    const result = await pool.query(`SELECT * FROM users where email = $1`, [email])
    return result.rows[0]
}

const saveRefreshToken = async (userId, refreshToken) => {
    const result = await pool.query(`UPDATE users SET refresh_token = $1 WHERE id = $2`, [refreshToken, userId])
}

const getUserByRefreshToken = async (refreshToken) => {
    const result = await pool.query(`SELECT * FROM users WHERE refresh_token = $1`, [refreshToken])
    return result.rows[0]
}

const deleteRefreshToken = async (userId) => {
    const result = await pool.query(`UPDATE users SET refresh_token = NULL WHERE id = $1`, [userId])
}

module.exports = { createUser, getUserByEmail, saveRefreshToken, getUserByRefreshToken, deleteRefreshToken }