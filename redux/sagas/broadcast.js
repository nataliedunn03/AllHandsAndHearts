import { takeEvery, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
	GET_BROADCAST_CARDS,
	REMOVE_BROADCAST_CARD,
	REMOVE_BROADCAST_CARD_SUCCESS,
	SENDING_REQUEST,
	GET_BROADCAST_CARDS_RECEIVED,
	GET_BROADCAST_CARDS_ON_LOGIN
} from '../actions/actionTypes';
import { getBroadcastCards } from '../../services/broadcast';

function* removeBroadcast(action) {
	// get action.cardKey and then make a server call
	yield put({
		type: REMOVE_BROADCAST_CARD_SUCCESS,
		cardKey: action.cardKey
	});
}

/**
 * Broadcast saga
 */
function* getBroadcast() {
	yield put({ type: SENDING_REQUEST, sending: true });
	//pass a username to get the cards
	const broadcastCards = yield call(getBroadcastCards, '');
	yield call(delay, 1000, true);
	if (broadcastCards) {
		yield put({
			type: GET_BROADCAST_CARDS_RECEIVED,
			broadcastCards: broadcastCards
		});
	}
	yield put({ type: SENDING_REQUEST, sending: false });
}

/**
 * minimizing the state changes so it doesn't reload
 */
function* getBroadcastOnLogin() {
	yield put({ type: SENDING_REQUEST, sending: true });
	const broadcastCards = yield call(getBroadcastCards, '');
	if (broadcastCards) {
		yield put({
			type: GET_BROADCAST_CARDS_RECEIVED,
			broadcastCards: broadcastCards
		});
	}
	yield put({ type: SENDING_REQUEST, sending: false });
}

function* saga() {
	yield takeEvery(GET_BROADCAST_CARDS_ON_LOGIN, getBroadcastOnLogin);
	yield takeEvery(GET_BROADCAST_CARDS, getBroadcast);
	yield takeEvery(REMOVE_BROADCAST_CARD, removeBroadcast);
}
export default saga;
