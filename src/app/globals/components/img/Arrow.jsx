import * as React from "react";
const Arrow = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    width={34}
    height={34}
    focusable="false"
    {...props}
  >
    <path
    d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"
    fill="var(--color-primary)"
    />
  </svg>
);
export default Arrow;