// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import { SITE_NAME, SIMPLE_SITE, ENABLE_NO_SOURCE_CLAIMS } from 'config';
import React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';
import ClaimPreviewTile from 'component/claimPreviewTile';
import Icon from 'component/common/icon';
import WaitUntilOnPage from 'component/common/wait-until-on-page';
import RecommendedPersonal from 'component/recommendedPersonal';
import { useIsLargeScreen } from 'effects/use-screensize';
import { GetLinksData } from 'util/buildHomepage';
import { getLivestreamUris } from 'util/livestream';
import ScheduledStreams from 'component/scheduledStreams';
import { splitBySeparator } from 'util/lbryURI';
import classnames from 'classnames';
import Ads from 'web/component/ads';

// @if TARGET='web'
import Meme from 'web/component/meme';
// @endif

function resolveTitleOverride(title: string) {
  return title === 'Recent From Following' ? 'Following' : title;
}

type Props = {
  authenticated: boolean,
  followedTags: Array<Tag>,
  subscribedChannels: Array<Subscription>,
  showNsfw: boolean,
  homepageData: any,
  activeLivestreams: any,
  doFetchActiveLivestreams: () => void,
  fetchingActiveLivestreams: boolean,
  hideScheduledLivestreams: boolean,
  adBlockerFound: ?boolean,
};

function HomePage(props: Props) {
  const {
    followedTags,
    subscribedChannels,
    authenticated,
    showNsfw,
    homepageData,
    activeLivestreams,
    doFetchActiveLivestreams,
    fetchingActiveLivestreams,
    hideScheduledLivestreams,
    adBlockerFound,
  } = props;

  const showPersonalizedChannels = (authenticated || !IS_WEB) && subscribedChannels && subscribedChannels.length > 0;
  const showPersonalizedTags = (authenticated || !IS_WEB) && followedTags && followedTags.length > 0;
  const showIndividualTags = showPersonalizedTags && followedTags.length < 5;
  const isLargeScreen = useIsLargeScreen();
  const channelIds = subscribedChannels.map((sub) => splitBySeparator(sub.uri)[1]);

  const rowData: Array<RowDataItem> = GetLinksData(
    homepageData,
    isLargeScreen,
    true,
    authenticated,
    showPersonalizedChannels,
    showPersonalizedTags,
    subscribedChannels,
    followedTags,
    showIndividualTags,
    showNsfw
  );

  type SectionHeaderProps = {
    title: string,
    navigate?: string,
    icon?: string,
    help?: string,
  };

  const SectionHeader = ({ title, navigate = '/', icon = '', help }: SectionHeaderProps) => {
    return (
      <h1 className="claim-grid__header">
        <Button navigate={navigate} button="link">
          <Icon className="claim-grid__header-icon" sectionIcon icon={icon} size={20} />
          <span className="claim-grid__title">{title}</span>
          {help}
        </Button>
      </h1>
    );
  };

  function getRowElements(title, route, link, icon, help, options, index, pinUrls) {
    const tilePlaceholder = (
      <ul className="claim-grid">
        {new Array(options.pageSize || 8).fill(1).map((x, i) => (
          <ClaimPreviewTile showNoSourceClaims={ENABLE_NO_SOURCE_CLAIMS} key={i} placeholder />
        ))}
      </ul>
    );

    const claimTiles = (
      <ClaimTilesDiscover
        {...options}
        showNoSourceClaims={ENABLE_NO_SOURCE_CLAIMS}
        hasSource
        prefixUris={getLivestreamUris(activeLivestreams, options.channelIds)}
        pinUrls={pinUrls}
        injectedItem={
          index === 0 && {
            node: <Ads small type="video" tileLayout />,
            replace: adBlockerFound === false,
          }
        }
      />
    );

    return (
      <div
        key={title}
        className={classnames('claim-grid__wrapper', {
          'show-ribbon': index === 0,
        })}
      >
        {title && typeof title === 'string' && (
          <SectionHeader title={__(resolveTitleOverride(title))} navigate={route || link} icon={icon} help={help} />
        )}

        {index === 0 && <>{claimTiles}</>}

        {index !== 0 && (
          <WaitUntilOnPage name={title} placeholder={tilePlaceholder} yOffset={800}>
            {claimTiles}
          </WaitUntilOnPage>
        )}

        {(route || link) && (
          <Button
            className="claim-grid__title--secondary"
            button="link"
            navigate={route || link}
            iconRight={ICONS.ARROW_RIGHT}
            label={__('View More')}
          />
        )}
      </div>
    );
  }

  React.useEffect(() => {
    doFetchActiveLivestreams();
  }, []);

  return (
    <Page className="homePage-wrapper" fullWidthPage>
      {!SIMPLE_SITE && (authenticated || !IS_WEB) && !subscribedChannels.length && (
        <div className="notice-message">
          <h1 className="section__title">
            {__("%SITE_NAME% is more fun if you're following channels", { SITE_NAME })}
          </h1>
          <p className="section__actions">
            <Button
              button="primary"
              navigate={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
              label={__('Find new channels to follow')}
            />
          </p>
        </div>
      )}

      {/* @if TARGET='web' */}
      {SIMPLE_SITE && <Meme />}
      {/* @endif */}

      <RecommendedPersonal />

      {!fetchingActiveLivestreams && (
        <>
          {authenticated && channelIds.length > 0 && !hideScheduledLivestreams && (
            <ScheduledStreams
              channelIds={channelIds}
              tileLayout
              liveUris={getLivestreamUris(activeLivestreams, channelIds)}
              limitClaimsPerChannel={2}
            />
          )}
        </>
      )}

      {rowData.map(({ title, route, link, icon, help, pinnedUrls: pinUrls, options = {} }, index) => {
        // add pins here
        return getRowElements(title, route, link, icon, help, options, index, pinUrls);
      })}
    </Page>
  );
}

export default HomePage;
