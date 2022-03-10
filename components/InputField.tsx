const InputField = ({ label, name, register, error, ...props }: any) => {
  return (
    <div className="my-1 flex flex-col">
      <label htmlFor={name} className="text-sm">
        {label}
      </label>
      <input
        id={name}
        className="border border-gray-300 p-1 outline-none focus:border-gray-500"
        {...register(name)}
        {...props}
      />
      <div className="text-sm text-red-400">{error}</div>
    </div>
  );
};

export default InputField;
