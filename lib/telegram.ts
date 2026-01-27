const WebApp = typeof window !== 'undefined' ? require('@twa-dev/sdk').default : null;

export const telegram = WebApp;

export const initTelegram = () => {
  if (telegram) {
    telegram.ready();
    telegram.expand();
  }
};

export const getInitData = () => {
  return telegram?.initData || '';
};
