import { Tooltip } from "react-tooltip";

export default ({ initials, size, className, badgeNumber, ...rest }) => {
  const sizeClass = "avatar-large";

  if (initials) {
    return (
      <span
        className={`avatar avatar-initials ${sizeClass} ${className}`}
        title={initials}
        data-tooltip-id="my-tooltip"
        data-tooltip-content={initials}
        data-tooltip-place="top"
        {...rest}
      >
        {initials.substring(0, 3)}
        {badgeNumber && <span className="badge-number">{badgeNumber}</span>}
        <Tooltip id="my-tooltip" />
      </span>
    );
  }

  return null;
};
