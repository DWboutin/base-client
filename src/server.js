import React from 'react';
import { renderToString } from 'react-dom/server';
import express from 'express';
import config from 'config';

import routing from './middlewares/routing';

import Html from './Html.react';

const { APP_PORT } = config;

const app = express();

app.listen(APP_PORT, () => {
  console.log('APP is listening on port ' + APP_PORT + '; Env: ' + process.env.NODE_ENV);
});

app.use((req, res, next) => {
  routing(req, res)
    .then((result) => {
      res.status(200).send('<!DOCTYPE html>\n' + renderToString(<Html component={result.component} initialState={result.initialState} />));
    })
    .catch((err) => {
      console.log(req.url, err);
      res.redirect('/login');
      next();
    });
});

export default app;