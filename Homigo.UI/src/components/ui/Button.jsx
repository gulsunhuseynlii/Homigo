function Button({
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition duration-300 hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;