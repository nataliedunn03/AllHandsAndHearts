import { takeEvery, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
	GET_BROADCAST_CARDS,
	REMOVE_BROADCAST_CARD,
	REMOVE_BROADCAST_CARD_SUCCESS,
	SENDING_REQUEST,
	GET_BROADCAST_CARDS_RECEIVED,
	GET_BROADCAST_CARDS_ON_LOGIN,
	REQUEST_ERROR
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

const getBroadcastsHelper = function* getBroadcastsHelper() {
	yield put({ type: SENDING_REQUEST, sending: true });
	try {
		//pass a username to get the cards
		const broadcastCards = yield call(getBroadcastCards, '');
		yield call(delay, 1000, true); // simulate network events
		return broadcastCards;
	} catch (error) {
		yield put({ type: REQUEST_ERROR, error: error.message });
		return false;
	} finally {
		yield put({ type: SENDING_REQUEST, sending: false });
	}
};

function* getBroadcast() {
	const broadcasts = yield call(getBroadcastsHelper);
	if (broadcasts) {
		yield put({
			type: GET_BROADCAST_CARDS_RECEIVED,
			broadcastCards: broadcasts
		});
	}
}

function* saga() {
	yield takeEvery(GET_BROADCAST_CARDS_ON_LOGIN, getBroadcast);
	yield takeEvery(GET_BROADCAST_CARDS, getBroadcast);
	yield takeEvery(REMOVE_BROADCAST_CARD, removeBroadcast);
}
export default saga;
