
import React from 'react';

interface WalletIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
}

export default function WalletIcon({
  width = 32,
  height = 30,
  className,
  ...rest
}: WalletIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 30"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...rest}
    >
      <rect width="25" height="30" fill="url(#pattern0_39_48)" />
      <defs>
        <pattern
          id="pattern0_39_48"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_39_48"
            transform="matrix(0.0111111 0 0 0.00925926 0 0.0833333)"
          />
        </pattern>
        <image
          id="image0_39_48"
          width="90"
          height="90"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAACHElEQVR4nO3cP2sUQRzG8cHCIB6pDdpJLI3VGS0C/nk5KiSvJImCUV+LSJoknVZqH0tR8CKJ1TcsTEBDZrOL2WcnM88HrsvN7e/LMLdwYUMwMzMzMzMzM7N/AI+At8AX4IDL6SfwCrgWcgPcBt5Tlq2QE+Ah8J3y/AauhIx2comRswtd2nHxt9chB8BjyvQD2MzmyzDeXZzlEFgFbox9jUUAviZCr459bUUBZonQ3skXqeWMc2hR6LUL/aDatYRuvgzXgIWxr7H00KU6APaAF8CcQ2t8Am45tC728DtbNEzunju0xq5Da8wcWsShRRxaxKFFHFrEoUUcWsShRRxaxKFFHFrEoUUcWsShRRxaxKG7a361XwemwPX4ug9sAEfnvdmhu9kH7rbMuBT/Jsmhu+3kZORTsZM726HPt95j1ubfeM80bOUyQk97zLqcWmTYymWEnvSYdZJaZNjK9YWeTy0ybOUyQk97zOqj4z9s9Jj1ZWqRYSuXEfqouXXrMOc94E9qEYfuZr8tdoz8rW0Bh+63szfjOTyJrwfxuEju5BMOLeLQIg4t4tAiDi3i0CIOLeLQIg4t4tAiDi3i0AWFTj0YpSphxEf9VCUIQr8be8haQj8de8gM/Bo8dIy9Td12VaHvxAfy1eqZJHSMvVJp7I/AVVnoGHsR+EBdkW9KI58K/gR4A3wu8D57Buw0x4V8J5uZmZmZmZmZhTwdA/4xfivWOufAAAAAAElFTkSuQmCC"
        />
      </defs>
    </svg>
  );
}

