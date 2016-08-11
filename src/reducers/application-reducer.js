/**
 * @file Reducer "application" pour gérer les états et settings de l'application
 * @author Mikael Boutin
 * @version 0.0.1
 */
import consts from 'consts';

const { ACTIONS } = consts;

const initialState = {};

export function application(state = initialState, action = {}) {
	switch(action.type) {
		default:
			return state;
	}
}
