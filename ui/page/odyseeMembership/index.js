import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import OdyseeMembership from './view';
import { selectActiveChannelClaim, selectIncognito } from 'redux/selectors/app';
import { selectMyChannelClaims, selectClaimsByUri } from 'redux/selectors/claims';
import { doFetchUserMemberships, doCheckUserOdyseeMemberships } from 'redux/actions/user';
import { selectUser } from 'redux/selectors/user';

const select = (state) => {
  const activeChannelClaim = selectActiveChannelClaim(state);

  return {
    activeChannelClaim,
    channels: selectMyChannelClaims(state),
    claimsByUri: selectClaimsByUri(state),
    incognito: selectIncognito(state),
    user: selectUser(state),
  };
};

const perform = dispatch => ({
  openModal: (modal, props) => dispatch(doOpenModal(modal, props)),
  doFetchUserMemberships: (claimIds) => dispatch(doFetchUserMemberships(claimIds)),
  updateUserOdyseeMembershipStatus: (user) => doCheckUserOdyseeMemberships(dispatch, user),
});

export default connect(select, perform)(OdyseeMembership);
