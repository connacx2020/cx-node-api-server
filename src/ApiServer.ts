import express = require('express');
import bodyParser = require('body-parser');
import dotenv = require('dotenv');
const cors = require('cors');
let userRoutes = require('./routes/userRoute');

var app = express();
dotenv.config();
var url = `${process.env.MONGO}://${process.env.MONGO_HOST}/${process.env.DB_NAME}`;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', userRoutes);

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening at ${port}`)
});