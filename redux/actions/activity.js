/**
 * Activities actions displayed on Home page
 */
import {
  GET_ACTIVITY_CARDS,
  SET_ACTIVITY_CARD_VOTE,
  GET_VOTED_ACTIVITIES_ON_LOGIN
} from './actionTypes';

export const getActivities = () => ({
  type: GET_ACTIVITY_CARDS
});

export const setActivityVote = (pinId, vote) => ({
  type: SET_ACTIVITY_CARD_VOTE,
  pinId,
  vote
});

export const getVotedActivities = () => ({
  type: GET_VOTED_ACTIVITIES_ON_LOGIN
});
