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
export const shareReferral = (userId: string) => {
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'LotooryBot';
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'lotoory';
  const referralLink = `https://t.me/${botUsername}/${appName}?startapp=${userId}`;
  const text = `Hey! Join me on Lotoory and let's earn coins together! 🚀 💎 5,000 coins bonus for you!`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;

  if (telegram) {
    telegram.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, '_blank');
  }
};
