const express = require('express');
require('dotenv').config();

const notesRouter = require('./src/routes/notes');

const app = express();
app.use(express.json());

app.use('/notes', notesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});