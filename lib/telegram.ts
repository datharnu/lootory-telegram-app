import WebApp from "@twa-dev/sdk";

export const telegram = WebApp;

export const initTelegram = () => {
  telegram.ready();
  telegram.expand();
};

export const getInitData = () => {
  return telegram.initData;
};
