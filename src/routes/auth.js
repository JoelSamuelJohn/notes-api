const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { createUser, getUserByEmail, saveRefreshToken, getUserByRefreshToken, deleteRefreshToken } = require('../queries/users');

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'content missing' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        const user = await createUser(name, email, hashedPassword)
        res.status(201).json(user)
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'email already in use' });
        }
        res.status(500).json({ error: err.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({error: 'content missing'})
    }
    try {
        const user = await getUserByEmail(email);
        if(!user) {
            return res.status(401).json({error: 'invalid credentials'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(401).json({ error: 'invalid credentials' })
        }

        const accessToken = jwt.sign({id: user.id, email: user.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign({id: user.id, email: user.email}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
        await saveRefreshToken(user.id, refreshToken)
        return res.status(200).json({accessToken: accessToken, refreshToken: refreshToken})
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body
    if(!refreshToken) {
        return res.status(401).json({ error: 'invalid credentials' })
    }
    try {
        const user = await getUserByRefreshToken(refreshToken)
        if(!user) {
            return res.status(403).json({ error: 'invalid refresh token'})
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const accessToken = jwt.sign({id: decoded.id, email: decoded.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
        return res.status(200).json({accessToken: accessToken})
    }
    catch(err) {
        res.status(403).json({ error: 'invalid refresh token' });
    }
})


router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body
    if(!refreshToken) {
        return res.status(400).json({error:'invalid credentails'})
    }
    try {
        const getUserId = await getUserByRefreshToken(refreshToken)
        if(!getUserId) {
            return res.status(403).json({ error: 'invalid refresh token' })
        } 
        await deleteRefreshToken(getUserId.id)
        res.status(200).json({ message: 'logged out successfully' })
    }
    catch(err) {
        res.status(403).json({ error: 'invalid refresh token' });
    }
})


module.exports = router;
