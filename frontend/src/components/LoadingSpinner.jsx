import PropTypes from "prop-types";

const LoadingSpinner = ({ size = "sm", color = "white" }) => {
  const sizeClass = {
    xs: "w-3 h-3 border-[1.5px]",
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-6 h-6 border-[3px]",
  }[size];

  const colorClass = {
    white: "border-white border-t-transparent",
    black: "border-black border-t-transparent",
    gray: "border-gray-400 border-t-transparent",
    green: "border-green-500 border-t-transparent",
  }[color];

  return (
    <span
      className={`inline-block rounded-full animate-spin ${sizeClass} ${colorClass}`}
    />
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  color: PropTypes.oneOf(["white", "black", "gray", "green"]),
};

export default LoadingSpinner;
