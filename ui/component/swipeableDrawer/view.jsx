// @flow
import 'scss/component/_swipeable-drawer.scss';

// $FlowFixMe
import { Global } from '@emotion/react';
// $FlowFixMe
import { grey } from '@mui/material/colors';

import { HEADER_HEIGHT_MOBILE } from 'component/fileRenderFloating/view';
import { PRIMARY_PLAYER_WRAPPER_CLASS, PRIMARY_IMAGE_WRAPPER_CLASS } from 'page/file/view';
import { SwipeableDrawer as MUIDrawer } from '@mui/material';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import Button from 'component/button';
import classnames from 'classnames';

const DRAWER_PULLER_HEIGHT = 42;

type Props = {
  children: Node,
  open: boolean,
  theme: string,
  mobilePlayerDimensions: { height: ?number },
  title: any,
  hasSubtitle?: boolean,
  actions?: any,
  toggleDrawer: () => void,
};

export default function SwipeableDrawer(props: Props) {
  const { mobilePlayerDimensions, title, hasSubtitle, children, open, theme, actions, toggleDrawer } = props;

  const [coverHeight, setCoverHeight] = React.useState();
  const [scrollHeight, setScrollHeight] = React.useState();

  const mobileCoverHeight = React.useRef();
  const mobileScrollTop = React.useRef();

  const videoHeight = scrollHeight || (mobilePlayerDimensions && mobilePlayerDimensions.height) || coverHeight || 0;

  const handleResize = React.useCallback(() => {
    if (!mobilePlayerDimensions.height) {
      const element =
        document.querySelector(`.${PRIMARY_IMAGE_WRAPPER_CLASS}`) ||
        document.querySelector(`.${PRIMARY_PLAYER_WRAPPER_CLASS}`);

      if (!element) return;

      const rect = element.getBoundingClientRect();
      setCoverHeight(rect.height);
    } else {
      const windowWidth = window.innerWidth;
      const maxLandscapeHeight = (windowWidth * 9) / 16;
      setScrollHeight(maxLandscapeHeight);
    }
  }, [mobilePlayerDimensions.height]);

  React.useEffect(() => {
    // Drawer will follow the cover image on resize, so it's always visible
    if (open) {
      handleResize();

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [handleResize, mobilePlayerDimensions, open]);

  // Reset scroll position when opening: avoid broken position where
  // the drawer is lower than the video
  React.useEffect(() => {
    const cover = document.querySelector(`.${PRIMARY_PLAYER_WRAPPER_CLASS}`);

    if (open) {
      mobileScrollTop.current = document.documentElement.scrollTop;
      if (document && document.documentElement) document.documentElement.scrollTop = 0;

      const windowWidth = window.innerWidth;
      const maxLandscapeHeight = (windowWidth * 9) / 16;
      mobileCoverHeight.current = cover.offsetHeight;
      cover.style.height = `${maxLandscapeHeight}px`;
    } else if (mobileCoverHeight.current) {
      cover.style.height = `${mobileCoverHeight.current}px`;
    }
  }, [open]);

  return (
    <>
      <DrawerGlobalStyles open={open} videoHeight={videoHeight} />

      <MUIDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        hideBackdrop
        disableEnforceFocus
        disablePortal
        disableSwipeToOpen
        ModalProps={{ keepMounted: true }}
      >
        {open && (
          <div className="swipeable-drawer__header" style={{ top: -DRAWER_PULLER_HEIGHT }}>
            <Puller theme={theme} />
            <HeaderContents title={title} hasSubtitle={hasSubtitle} actions={actions} toggleDrawer={toggleDrawer} />
          </div>
        )}

        {children}
      </MUIDrawer>
    </>
  );
}

type GlobalStylesProps = {
  open?: boolean,
  videoHeight: number,
};

const DrawerGlobalStyles = (globalStylesProps: GlobalStylesProps) => {
  const { open, videoHeight } = globalStylesProps;

  const windowWidth = window.innerWidth;
  const maxLandscapeHeight = (windowWidth * 9) / 16;

  return (
    <Global
      styles={{
        '.main-wrapper__inner--filepage': {
          overflow: open ? 'hidden' : 'unset',
          maxHeight: open ? '100vh' : 'unset',
        },
        '.main-wrapper .MuiDrawer-root': {
          top: `calc(${HEADER_HEIGHT_MOBILE}px + ${videoHeight}px) !important`,
        },
        '.main-wrapper .MuiDrawer-root > .MuiPaper-root': {
          overflow: 'visible',
          color: 'var(--color-text)',
          position: 'absolute',
          height: `calc(100% - ${DRAWER_PULLER_HEIGHT}px)`,
        },
        video: {
          top: open ? '-100px !important' : 'unset',
        },
        '.vjs-touch-overlay': {
          height: open ? `${maxLandscapeHeight}px !important` : 'unset',
        },
        '.content__viewer': {
          paddingBottom: open ? `${maxLandscapeHeight}px !important` : 'unset',
        },
      }}
    />
  );
};

type PullerProps = {
  theme: string,
};

const Puller = (pullerProps: PullerProps) => {
  const { theme } = pullerProps;

  return (
    <span className="swipeable-drawer__puller" style={{ backgroundColor: theme === 'light' ? grey[300] : grey[800] }} />
  );
};

type HeaderProps = {
  title: any,
  hasSubtitle?: boolean,
  actions?: any,
  toggleDrawer: () => void,
};

const HeaderContents = (headerProps: HeaderProps) => {
  const { title, hasSubtitle, actions, toggleDrawer } = headerProps;

  return (
    <div
      className={classnames('swipeable-drawer__header-content', {
        'swipeable-drawer__header--with-subtitle': hasSubtitle,
      })}
    >
      {title}

      <div className="swipeable-drawer__header-actions">
        {actions}

        <Button icon={ICONS.REMOVE} iconSize={16} onClick={toggleDrawer} />
      </div>
    </div>
  );
};

type ExpandButtonProps = {
  label: any,
  toggleDrawer: () => void,
};

export const DrawerExpandButton = (expandButtonProps: ExpandButtonProps) => {
  const { label, toggleDrawer } = expandButtonProps;

  return (
    <Button
      className="swipeable-drawer__expand-button"
      label={label}
      button="primary"
      icon={ICONS.CHAT}
      onClick={toggleDrawer}
    />
  );
};
