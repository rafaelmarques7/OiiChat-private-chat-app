export default ({ src, initials, size, className, ...rest }) => {
  const sizeClass = "avatar-large";

  if (src) {
    return (
      <img
        className={`avatar ${sizeClass} ${className}`}
        src={src}
        alt="..."
        title={initials}
        {...rest}
      />
    );
  }

  if (initials) {
    return (
      <span
        className={`avatar avatar-initials ${sizeClass} ${className}`}
        title={initials}
        {...rest}
      >
        {initials.charAt(0)}
      </span>
    );
  }

  return null;
};
