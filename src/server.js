import express from 'express';
import config from './config';

const { APP_PORT } = config;

const app = express();

/** Écoute d'Express sur le port désiré */
app.listen(APP_PORT, () => {
  console.log('APP is listening on port ' + APP_PORT + '; Env: ' + process.env.NODE_ENV);
});

export default app;