/**
 * @file Router (serverside) pour rendre les routes et les components reliés à ceux-ci.
 * @author Mikael Boutin
 * @version 0.0.1
 */
import React from 'react';
import { trigger } from 'redial';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import useQueries from 'history/lib/useQueries';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import { thunkMiddleware } from './thunkMiddleware';
import reducers from 'reducers';
import routes from '../routes';

const store = applyMiddleware(thunkMiddleware)(createStore)(reducers);
const { dispatch } = store;

/**
 * Retourne les propriétés à rendre du côté serveur
 * @function
 * @param {object} renderProps Les propriétés retournés par le router
 * @return {object} Contenant le component associé avec la route en cours et le store
 */
function getRootComponent(renderProps) {
  const state = store.getState();

  const component = (
    <Provider store={store}>
      <RouterContext {...renderProps} />
    </Provider>
  );

  return {
    component,
    initialState: state,
  };
}

/**
 * Retourne les propriétés à rendre du côté serveur
 * @function
 * @param {object} req Objet transmi par Express en middleware
 * @param {object} res Objet transmi par Express en middleware
 * @return {promise} Un promesse contenant les éléments à rendre par React
 */
function routing(req, res) {
  const history = useQueries(createMemoryHistory)();
  const location = history.createLocation(req.url);

  return new Promise((resolve, reject) => {
    match({ routes, location }, (error, redirectLocation, renderProps) => {
      // Get array of route components:
      const components = renderProps.routes.map(route => route.component);
      // Define locals to be provided to all fetcher functions:
      const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,
        cookies: req.cookies,
        // Allow fetcher functions to dispatch Redux actions:
        dispatch,
      };

      if (typeof req.cookies.user_token === 'undefined' && req.url !== '/login') {
        res.status(301).redirect('/login');
      } else {
        if (redirectLocation) {
          reject(res.status(301).redirect(redirectLocation.pathname + redirectLocation.search));
        } else if (error) {
          reject(res.status(500).send(error.message));
        } else if (renderProps === null) {
          reject(res.status(404).send('Not found'));
        }

        // trigger l'action de "redial"
        trigger('fetch', components, locals)
          .then((cookieValues) => {
            let cookieTime = 3600000; // 1 heure

            if (typeof cookieValues !== 'undefined' && typeof cookieValues[0] !== 'undefined') {
              if (typeof req.cookies.remember_me !== 'undefined') {
                cookieTime = 1296000000; // 15 jours
                res.cookie('remember_me', true, { maxAge: cookieTime, httpOnly: false });
              }

              res.cookie('user_loggedIn', cookieValues[0].user_loggedIn, { maxAge: cookieTime, httpOnly: false });
              res.cookie('user_id', cookieValues[0].user_id, { maxAge: cookieTime, httpOnly: false });
              res.cookie('user_token', cookieValues[0].user_token, { maxAge: cookieTime, httpOnly: false });
            }

            resolve(getRootComponent(renderProps));
          })
          .catch(reject);
      }
    });
  });
}

export default routing;
