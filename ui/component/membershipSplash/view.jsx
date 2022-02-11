// @flow
import * as ICONS from 'constants/icons';
import { Lbryio } from 'lbryinc';
import { getStripeEnvironment } from 'util/stripe';
import Icon from 'component/common/icon';
import Button from 'component/button';
import React from 'react';
import * as MODALS from 'constants/modal_types';
import AstronautAndFriends from './astronaut_n_friends.png';
import BadgePremium from './badge_premium.png';
import BadgePremiumPlus from './badge_premium-plus.png';
import OdyseePremium from './odysee_premium.png';
let stripeEnvironment = getStripeEnvironment();

type Props = {};

export default function MembershipSplash(props: Props) {
  // const { } = props;

  const [membershipOptions, setMembershipOptions] = React.useState();
  const { openModal, odyseeMembership } = props;
  const logo = <Icon className="header__logo" icon={ICONS.ODYSEE_WHITE_TEXT} />;

  const odyseeChannelId = '80d2590ad04e36fb1d077a9b9e3a8bba76defdf8';
  const odyseeChannelName = '@odysee';

  React.useEffect(function () {
    (async function () {
      try {
        // check if there is a payment method
        const response = await Lbryio.call(
          'customer',
          'status',
          {
            environment: stripeEnvironment,
          },
          'post'
        );
        // hardcoded to first card
        const hasAPaymentCard = Boolean(response && response.PaymentMethods && response.PaymentMethods[0]);

        setCardSaved(hasAPaymentCard);
      } catch (err) {
        console.log(err);
      }

      try {
        // check the available membership for odysee.com
        const response = await Lbryio.call(
          'membership',
          'list',
          {
            environment: stripeEnvironment,
            channel_id: odyseeChannelId,
            channel_name: odyseeChannelName,
          },
          'post'
        );
        setMembershipOptions(response);
      } catch (err) {
        console.log(err);
      }

      try {
        // show the memberships the user is subscribed to
        const response = await Lbryio.call(
          'membership',
          'mine',
          {
            environment: stripeEnvironment,
          },
          'post'
        );

        let activeMemberships = [];
        let canceledMemberships = [];
        let purchasedMemberships = [];

        for (const membership of response) {
          const isActive = membership.Membership.auto_renew;
          if (isActive) {
            activeMemberships.push(membership);
          } else {
            canceledMemberships.push(membership);
          }
          purchasedMemberships.push(membership.Membership.membership_id);
        }

        setActiveMemberships(activeMemberships);
        setCanceledMemberships(canceledMemberships);
        setPurchasedMemberships(purchasedMemberships);

        setUserMemberships(response);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const earlyAcessInfo = (
    <div className="membership-splash__info-content">
      <Icon icon={ICONS.EARLY_ACCESS} />
      {__('Early access to features')}
    </div>
  );
  const badgeInfo = (
    <div className="membership-splash__info-content">
      <Icon icon={ICONS.MEMBER_BADGE} />
      {__('Badge on profile')}
    </div>
  );
  const noAdsInfo = (
    <div className="membership-splash__info-content">
      <Icon icon={ICONS.NO_ADS} />
      {__('No ads')}
    </div>
  );

  const purchaseMembership = async function (e) {
    e.preventDefault();
    e.stopPropagation();

    const membershipId = e.currentTarget.getAttribute('membership-id');
    let subscriptionPeriod = e.currentTarget.getAttribute('membership-subscription-period');

    if (subscriptionPeriod === 'both') {
      subscriptionPeriod = false;
    } else if (subscriptionPeriod === 'yearly') {
      subscriptionPeriod = true;
    } else {
      console.log('There was a bug');
      return;
    }

    openModal(MODALS.CONFIRM_ODYSEE_MEMBERSHIP, {
      membershipId,
      subscriptionPeriod,
      odyseeChannelId,
      odyseeChannelName,
    });
  };

  return (
    <div className="membership-splash">
      <div className="membership-splash__banner">
        <img src={AstronautAndFriends} />
        <section className="membership-splash__title">
          <section>
            <img src={OdyseePremium} />
          </section>
          <section>
            {__('Get ')}
            <b>{__('early access')}</b>
            {__(' features and remove ads for ')}
            <b>{__('99c')}</b>
          </section>
        </section>
      </div>

      <div className="membership-splash__info-wrapper">
        <div className="membership-splash__info">
          {__(
            "Creating a revolutionary video platform for everyone is something we're proud to be doing, but it isn't something that can happen without support. If you believe in Odysee's mission, please consider becoming a Premium member. As a Premium member, you'll be helping us build the best platform in the universe and we'll give you some cool perks."
          )}
        </div>

        <div className="membership-splash__info">
          <section className="membership-splash__info-header">
            <div className="membership-splash__info-price">
              <img src={BadgePremium} />

              <section>
                {__('99¢')}
                <div className="membership-splash__info-range">{__('A MONTH')}</div>
              </section>
            </div>
          </section>

          {badgeInfo}

          {earlyAcessInfo}

          <div className="membership-splash__info-button">
            {membershipOptions && (
              <Button
                button="primary"
                onClick={purchaseMembership}
                membership-id={membershipOptions[0].id}
                membership-subscription-period={membershipOptions[0].type}
                label={__('Apply for Membership')}
                onClick={purchaseMembership}
              />
            )}
          </div>
        </div>

        <div className="membership-splash__info">
          <section className="membership-splash__info-header">
            <div className="membership-splash__info-price">
              <img src={BadgePremiumPlus} />
              <section>
                {__('$2.99')}
                <div className="membership-splash__info-range">{__('A MONTH')}</div>
              </section>
            </div>
          </section>

          {noAdsInfo}

          {badgeInfo}

          {earlyAcessInfo}
          <div className="membership-splash__info-button">
            {membershipOptions && (
              <Button
                button="primary"
                onClick={purchaseMembership}
                membership-id={membershipOptions[1].id}
                membership-subscription-period={membershipOptions[1].type}
                label={__('Apply for Membership')}
                onClick={purchaseMembership}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
