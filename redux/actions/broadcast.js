import { REMOVE_BROADCAST_CARD, GET_BROADCAST_CARDS } from './actionTypes';

export const removeBroadcastCard = cardKey => ({
	type: REMOVE_BROADCAST_CARD,
	cardKey
});

export const getBroadcastCards = () => ({
	type: GET_BROADCAST_CARDS
});
