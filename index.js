import express from 'express';
import router from './src/routes/index.js';
import env from 'dotenv';

// Setup ENV
env.config();

const app = express();
const port = process.env.APP_PORT;

// Allow request from application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// Allow request from application/json
app.use(express.json());

app.use(router);

app.listen(port, () => {
    console.log(`App listening at ${process.env.APP_URL}:${port}`);
});