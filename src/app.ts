import * as dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { getMongoConnection } from './models';
import StoreRouter from './routes/stores'

export const app = express();
app.use('/stores', StoreRouter);

app.use('*', (req, res) => {
    res.status(404).send('Not Found');
})