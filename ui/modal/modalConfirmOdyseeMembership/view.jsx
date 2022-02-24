// @flow
import React from 'react';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import { Lbryio } from 'lbryinc';
import { getStripeEnvironment } from 'util/stripe';
let stripeEnvironment = getStripeEnvironment();

type Props = {
  closeModal: () => void,
  paymentMethodId: string,
  setAsConfirmingCard: () => void, // ?
  hasMembership: boolean, // user already has purchased --> invoke Cancel then
  membershipId: string,
  populateMembershipData: () => void,
  odyseeChannelId: string,
  odyseeChannelName: string,
  priceId: string,
  purchaseString: string,
  plan: string,
  setMembershipOptions: (any) => void,
  doToast: ({ message: string }) => void,
};

export default function ConfirmOdyseeMembershipPurchase(props: Props) {
  const {
    closeModal,
    membershipId,
    populateMembershipData,
    odyseeChannelId,
    odyseeChannelName,
    hasMembership,
    priceId,
    purchaseString,
    plan,
    setMembershipOptions,
    doToast,
  } = props;

  const [waitingForBackend, setWaitingForBackend] = React.useState();
  const [statusText, setStatusText] = React.useState();

  async function purchaseMembership() {
    try {
      setWaitingForBackend(true);
      setStatusText(__('Facilitating your purchase...'));

      // show the memberships the user is subscribed to
      const response = await Lbryio.call(
        'membership',
        'buy',
        {
          environment: stripeEnvironment,
          membership_id: membershipId,
          channel_id: odyseeChannelId,
          channel_name: odyseeChannelName,
          price_id: priceId,
        },
        'post'
      ).catch((error) => {
        doToast({
          message: __("Sorry, your purchase wasn't able to completed. Please contact support for possible next steps"),
          isError: true,
        });
        closeModal();
        throw new Error(error);
      });

      console.log('purchase, purchase membership response');
      console.log(response);

      // $FlowFixMe
      let newURL = location.href.split('?')[0];
      window.history.pushState('object', document.title, newURL);

      setStatusText(__('Membership purchase was successful'));

      await populateMembershipData();
      // clear the other membership options after making a purchase
      setMembershipOptions(false);

      closeModal();
    } catch (err) {
      console.log(err);
    }
  }

  // Cancel
  async function cancelMembership() {
    try {
      setWaitingForBackend(true);
      setStatusText(__('Canceling your membership...'));

      // show the memberships the user is subscribed to
      const response = await Lbryio.call(
        'membership',
        'cancel',
        {
          environment: stripeEnvironment,
          membership_id: membershipId,
        },
        'post'
      );

      console.log('cancel, cancel membership response');
      console.log(response);

      setStatusText(__('Membership successfully canceled'));

      await populateMembershipData();

      closeModal();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Modal ariaHideApp={false} isOpen contentLabel={'Confirm Membership Purchase'} type="card" onAborted={closeModal}>
      <Card
        className="stripe__confirm-remove-membership"
        title={hasMembership ? __('Confirm Membership Cancellation') : __(`Confirm %plan% Membership`, { plan })}
        subtitle={purchaseString}
        actions={
          <div className="section__actions">
            {!waitingForBackend ? (
              <>
                <Button
                  className="stripe__confirm-remove-card"
                  button="primary"
                  icon={ICONS.FINANCE}
                  label={hasMembership ? __('Confirm Cancellation') : __('Confirm Purchase')}
                  onClick={() => (hasMembership ? cancelMembership() : purchaseMembership())}
                />
                <Button button="link" label={__('Cancel')} onClick={closeModal} />
              </>
            ) : (
              <h1 style={{ fontSize: '18px' }}>{statusText}</h1>
            )}
          </div>
        }
      />
    </Modal>
  );
}
