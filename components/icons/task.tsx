




import React from 'react';

interface TaskIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
}

export default function TaskIcon({
  width = 32,
  height = 30,
  className,
  ...rest
}: TaskIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      {...rest}
    >
      <rect width="32" height="30" fill="url(#pattern0_39_46)" />
      <defs>
        <pattern
          id="pattern0_39_46"
    patternContentUnits="objectBoundingBox"
    width="1"
    height="1"
  >
    <use
      xlinkHref="#image0_39_46"
      transform="matrix(0.0104167 0 0 0.0111111 0.03125 0)"
    />
  </pattern>
  <image
    id="image0_39_46"
    width="90"
    height="90"
    preserveAspectRatio="none"
    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAABhElEQVR4nO3aS24CMRCE4d6QM5AT5nXOkOdlEthXNJmJFHYWsqtt/H8XaHcJAWpVBAAAAAAAAELSjaQnSS+STrpeJ0kHSY+Sdu6QbyV9aj4fkvbOT/KMIf95t3yyt6+L2T04gn7N3rIDB0fQx+wtO/DtCPpiMaC0XQh6lTa4RAwobReCXqUNLhEDStuFoFeOwfy9k74cQS9HpNk9O4Jerlizu3cdlZYr1qzebOfS5VS4XbFmDHlvCflf2LvlirV8X135D+Rx2/HOfvgHAADwoddhQK/DgF6H6HUY0eswoddh0nevowe19m2TbsHgUUSlfdukWzB4FFFp3zbpFgweRVTat026BYNHEZX2bZNuweBRRKV926R7Ppi/d6LX4UKvw4RehwG9DgN6HQ3R6wAAADOg12FAr8OAXofodRjR6zCh12EyR68jjNLeoA6EUdob1IEwSnuDOhBGaW9QB8Io7Q3qQBilvYG/d7/odZjQ6zCh12FAr8OAXkdD9DoAAAAAAADi3A+9GtfQL7nRVwAAAABJRU5ErkJggg=="
  />
</defs>
</svg>
  );
}

