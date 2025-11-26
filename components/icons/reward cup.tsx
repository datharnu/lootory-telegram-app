

import React from 'react';

interface CupIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
}

export default function CupIcon({
    width = 67,
    height = 47,
  className,
  ...rest
}: CupIconProps) {
  return (

<svg width={width} height={height} viewBox="0 0 57 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_176_89)">
<path d="M30.5939 20.233H26.2388V36.3119H30.5939V20.233Z" fill="url(#paint0_linear_176_89)"/>
<path d="M20.8634 34.8865H35.9683C36.0774 34.8865 36.1855 34.9064 36.2863 34.945C36.3871 34.9837 36.4786 35.0404 36.5558 35.1118C36.6329 35.1833 36.6941 35.2681 36.7359 35.3614C36.7776 35.4548 36.7991 35.5548 36.7991 35.6558V38.7029C36.7991 38.9068 36.7117 39.1024 36.5559 39.2466C36.4002 39.3908 36.189 39.4718 35.9688 39.4718H20.8644C20.7552 39.4718 20.6472 39.4519 20.5464 39.4133C20.4456 39.3746 20.354 39.3179 20.2769 39.2465C20.1997 39.175 20.1385 39.0902 20.0968 38.9969C20.055 38.9035 20.0335 38.8035 20.0335 38.7024V35.6549C20.0335 35.4511 20.121 35.2557 20.2766 35.1115C20.4322 34.9674 20.6433 34.8865 20.8634 34.8865Z" fill="url(#paint1_linear_176_89)"/>
<path d="M24.6786 7.23253V4.19745H4.28132V4.23982C4.12176 5.24382 4.02789 6.25582 4.00023 7.27031C3.97581 11.8037 5.85766 16.1678 9.24732 19.4388C11.9025 21.9533 14.1118 23.3741 16.2665 24.1402L14.3447 18.8786C11.0612 17.4882 7.19467 12.778 7.25536 7.2786V7.23253H24.6786Z" fill="url(#paint2_linear_176_89)"/>
<path d="M32.3172 7.23253V4.19745H52.7145V4.23982C52.8745 5.24379 52.9689 6.2558 52.9971 7.27031C53.0211 11.8039 51.1387 16.1681 47.7485 19.4388C45.0939 21.9533 42.884 23.3741 40.7293 24.1402L42.6536 18.8786C45.9371 17.4882 49.8026 12.778 49.7415 7.2786V7.23253H32.3172Z" fill="url(#paint3_linear_176_89)"/>
<g opacity="0.15">
<path d="M12.2786 4.19745V7.23253H24.6786V4.19745H12.2786ZM12.2786 17.6139V17.6886H12.29C12.3257 18.5345 12.4456 19.3757 12.6482 20.2012C12.8742 21.1226 13.2032 22.0196 13.6298 22.8779C14.4587 23.3831 15.3424 23.8066 16.2665 24.1416L14.3447 18.8799C13.5957 18.549 12.9003 18.1229 12.2786 17.6139Z" fill="#1A1B1E"/>
<path d="M32.3172 4.19745V7.23253H44.562V4.19745H32.3172ZM40.7289 24.1402C41.5713 23.8367 42.3799 23.4581 43.1432 23.0096C43.6981 21.9254 44.0958 20.778 44.3257 19.5972C44.4442 18.9869 44.5181 18.3699 44.5471 17.7503C43.9706 18.2 43.3341 18.5792 42.6532 18.8786L40.7289 24.1402Z" fill="#1A1B1E"/>
</g>
<path d="M13.1596 17.5573H13.1716C13.2039 18.357 13.3169 19.1523 13.5089 19.9326C14.0424 22.0803 15.1487 24.0699 16.7267 25.7195C18.1937 27.2459 19.9953 28.4652 22.0112 29.2961C24.0272 30.1271 26.2112 30.5506 28.4178 30.5384C28.9858 30.5387 29.5534 30.5111 30.1183 30.4559C32.6634 30.2253 35.105 29.4059 37.2188 28.073C39.3325 26.7401 41.0506 24.9366 42.2149 22.8281C43.0976 21.1865 43.5929 19.3898 43.668 17.5573H43.6785V0H13.1596V17.5573Z" fill="url(#paint4_linear_176_89)"/>
<path d="M39.2936 42.3314C39.2928 42.5633 39.193 42.7855 39.0159 42.9495C38.8388 43.1135 38.5988 43.206 38.3483 43.2067H18.4868C18.2364 43.206 17.9964 43.1135 17.8193 42.9495C17.6422 42.7855 17.5424 42.5633 17.5416 42.3314V39.4981C17.5416 39.2659 17.6412 39.0433 17.8184 38.8791C17.9957 38.715 18.2361 38.6227 18.4868 38.6227H38.3473C38.598 38.6227 38.8384 38.715 39.0157 38.8791C39.193 39.0433 39.2926 39.2659 39.2926 39.4981L39.2936 42.3314Z" fill="#555C84"/>
</g>
<defs>
<filter id="filter0_d_176_89" x="0" y="0" width="56.9973" height="51.2067" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_176_89"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_176_89" result="shape"/>
</filter>
<linearGradient id="paint0_linear_176_89" x1="26.2388" y1="28.2724" x2="30.5939" y2="28.2724" gradientUnits="userSpaceOnUse">
<stop stop-color="#FACE00"/>
<stop offset="1" stop-color="#F68600"/>
</linearGradient>
<linearGradient id="paint1_linear_176_89" x1="28.4163" y1="35.0882" x2="28.4163" y2="39.1738" gradientUnits="userSpaceOnUse">
<stop stop-color="#FACE00"/>
<stop offset="1" stop-color="#F68600"/>
</linearGradient>
<linearGradient id="paint2_linear_176_89" x1="14.3393" y1="3.47951" x2="14.3393" y2="7.60766" gradientUnits="userSpaceOnUse">
<stop stop-color="#FACE00"/>
<stop offset="1" stop-color="#F68600"/>
</linearGradient>
<linearGradient id="paint3_linear_176_89" x1="42.6572" y1="3.47951" x2="42.6572" y2="7.60766" gradientUnits="userSpaceOnUse">
<stop stop-color="#FACE00"/>
<stop offset="1" stop-color="#F68600"/>
</linearGradient>
<linearGradient id="paint4_linear_176_89" x1="13.4648" y1="15.2693" x2="43.8616" y2="15.2693" gradientUnits="userSpaceOnUse">
<stop stop-color="#FACE00"/>
<stop offset="1" stop-color="#F68600"/>
</linearGradient>
</defs>
</svg>

  );
}








