const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');

// Connecting DB
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true,
useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true}).then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(err);
})

// Middleware Init\\
app.use(express.json({ extended: false }));

// Routes
app.use('/api/pins', require('./routes/Pins'));
app.use('/api/users', require('./routes/Users'));

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));