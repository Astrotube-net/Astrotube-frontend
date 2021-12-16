import * as PAGES from 'constants/pages';
import { connect } from 'react-redux';
import { doFetchAccessToken } from 'redux/actions/user';
import { selectAccessToken, selectUser } from 'redux/selectors/user';
import HelpPage from './view';

const select = (state) => ({
  user: selectUser(state),
  accessToken: selectAccessToken(state),
});

const perform = (dispatch, ownProps) => ({
  doAuth: () => ownProps.history.push(`/$/${PAGES.AUTH}?redirect=/$/${PAGES.HELP}`),
  fetchAccessToken: () => dispatch(doFetchAccessToken()),
});

export default connect(select, perform)(HelpPage);
