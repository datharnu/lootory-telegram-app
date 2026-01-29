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
export const shareReferral = (referralCode: string) => {
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'LotooryBot';
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'lotoory';
  const referralLink = `https://t.me/${botUsername}/${appName}?startapp=ref_${referralCode}`;
  const text = `Let's roll some gifts! Use my invite link to join the fun. 🤍`;
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;

  if (telegram) {
    telegram.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, '_blank');
  }
};
