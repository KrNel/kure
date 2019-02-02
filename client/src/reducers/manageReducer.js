import {
  SELECT_GROUP,
  ADD_GROUP,
  DELETE_GROUP,
  ADD_POST,
  DELETE_POST
} from '../actions/manageActions';

export const manage = (
  state = {
    newGroup: '',
    groups: [],
    groupExists: false,
    exceededGrouplimit: false,
    isGroupsLoading: false,
    addGroupLoading: false,
    manageGroup: [],
    noOwned: true,
    errors: {},
    selectedGroup: '',
    modalOpen: false,
    modalData: {}
  },
  action) => {

  switch (action.type) {
    case SELECT_GROUP:
      return ({
        ...state,
        selectedGroup: action.group
      });
    /*case ADD_GROUP: {
      return ({
        ...state,
        isAuth: action.isAuth,
        isAuthorizing: false,
        userData: action.userData,
        csrf: action.csrf,
        lastUpdated: action.authedAt
      });
    }*/
    default:
      return state;
  }
}

export default manage;
