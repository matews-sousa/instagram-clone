const InputField = ({ label, name, register, error, ...props }: any) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        id={name}
        className="input input-bordered input-sm"
        {...register(name)}
        {...props}
      />
      <div className="text-sm text-red-400">{error}</div>
    </div>
  );
};

export default InputField;
