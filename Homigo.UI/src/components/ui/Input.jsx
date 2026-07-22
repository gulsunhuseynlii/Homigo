function Input({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="
        w-full
        rounded-xl
        border
        border-slate-300
        bg-white
        px-4
        py-3
        outline-none
        transition
        focus:border-blue-600
        focus:ring-2
        focus:ring-blue-200
      "
    />
  );
}

export default Input;