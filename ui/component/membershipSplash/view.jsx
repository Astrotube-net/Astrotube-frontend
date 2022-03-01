// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';

import Icon from 'component/common/icon';
import Button from 'component/button';

import React from 'react';
import AstronautAndFriends from './astronaut_n_friends.png';
import BadgePremium from './badge_premium.png';
import BadgePremiumPlus from './badge_premium-plus.png';
import OdyseePremium from './odysee_premium.png';
import I18nMessage from 'component/i18nMessage';

type Props = {
  pageLocation: string,
};

export default function MembershipSplash(props: Props) {
  const { pageLocation } = props;

  // const logo = <Icon className="header__logo" icon={ICONS.ODYSEE_WHITE_TEXT} />;

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

  return (
    <div className="membership-splash">
      <div className="membership-splash__banner">
        <img src={AstronautAndFriends} />
        <section className="membership-splash__title">
          <section>
            <img src={OdyseePremium} />
          </section>
          <section>
            <I18nMessage tokens={{ early_access: <b>{__('early access')}</b>, site_wide_badge: <b>{__('site-wide badge')}</b> }}>
              Get %early_access% features and a %site_wide_badge%
            </I18nMessage>
          </section>
        </section>
      </div>

      <div className="membership-splash__info-wrapper">
        <div className="membership-splash__info">
          <I18nMessage>
            Creating a revolutionary video platform for everyone is something we're proud to be doing, but it isn't
            something that can happen without support. If you believe in Odysee's mission, please consider becoming a
            Premium member. As a Premium member, you'll be helping us build the best platform in the universe and we'll
            give you some cool perks.
          </I18nMessage>
        </div>

        <div className="membership-splash__info">
          <section className="membership-splash__info-header">
            <div className="membership-splash__info-price">
              <img src={BadgePremium} />

              <section>
                <I18nMessage
                  tokens={{ date_range: <div className="membership-splash__info-range">{__('A MONTH')}</div> }}
                >
                  99¢ %date_range%
                </I18nMessage>
              </section>
            </div>
          </section>

          {badgeInfo}

          {earlyAcessInfo}

          <div className="membership-splash__info-button">
            <Button
              button="primary"
              label={__('Join')}
              navigate={`/$/${PAGES.ODYSEE_MEMBERSHIP}?interval=year&plan=Premium&pageLocation=${pageLocation}`}
            />
          </div>
        </div>

        <div className="membership-splash__info">
          <section className="membership-splash__info-header">
            <div className="membership-splash__info-price">
              <img src={BadgePremiumPlus} />
              <section>
                $2.99
                <div className="membership-splash__info-range">{__('A MONTH')}</div>
              </section>
            </div>
          </section>
          {badgeInfo}

          {earlyAcessInfo}

          {noAdsInfo}
          <div className="membership-splash__info-button">
            <Button
              button="primary"
              label={__('Join')}
              navigate={`/$/${PAGES.ODYSEE_MEMBERSHIP}?interval=year&plan=Premium%2b&pageLocation=${pageLocation}&`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
