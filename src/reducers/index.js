/**
 * @file Agrégateur des Reducers pour les changements d'états du store
 * @author Mikael Boutin
 * @version 0.0.1
 */
import { combineReducers } from 'redux';

import { application } from './application-reducer';

const reducers = combineReducers({ application });

export default reducers;
