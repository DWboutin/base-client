/**
 * @file Middleware qui permet d'utiliser dispatch à l'intérieur d'actions
 * @author Mikael Boutin
 * @version 0.0.1
 */

/**
 * Middleware qui permet d'utiliser dispatch à l'intérieur d'actions
 * @function
 * @param {object} store Store de l'application
 * @param {function} next Pour la continuation des opérations
 * @param {function} action Nouvel action à dispatch
 * @return {function} L'action à dispatch
 */
export const thunkMiddleware = store => next => action => {
  if (typeof action !== 'function') {
    // Normal action, pass it on
    return next(action);
  }
  const result = action(store.dispatch, store.getState);

  return result;
};
