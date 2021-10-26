import express from 'express';
import router from './src/routes/index.js';
import env from 'dotenv';

env.config();

const app = express();
const port = process.env.APP_PORT;

app.use(router);

app.listen(port, () => {
    console.log(`App listening at ${process.env.APP_URL}:${port}`);
});