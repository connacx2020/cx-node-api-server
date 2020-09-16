const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const magRoutes = require('./routes/magRoutes');
const ppcRoutes = require('./routes/ppcRoutes');
const authRoutes = require('./routes/authRoutes');
const patronasRoutes = require('./routes/patronasRoutes');

// pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
// pool.query(`
//     CREATE TABLE IF NOT EXISTS users (id uuid DEFAULT uuid_generate_v4(),
//     username VARCHAR UNIQUE NOT NULL,
//     password VARCHAR NOT NULL,
//     name VARCHAR NOT NULL,
//     client VARCHAR NOT NULL,
//     PRIMARY KEY (id))`
// );

dotenv.config();

var app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/mag', magRoutes);
app.use('/ppc', ppcRoutes);
app.use('/patronas', patronasRoutes)

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening at http://${process.env.HOST}:${port}`)
});
