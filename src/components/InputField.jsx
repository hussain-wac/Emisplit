import React from "react";
import { useField } from "informed";

const InputField = ({ field }) => {
  const { id, label, type, placeholder, required } = field;
  const {
    fieldState: { value, error },
    fieldApi: { setValue },
    ref,
  } = useField({
    name: id,
    validateOn: "change",
  });

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700" htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={id}
        ref={ref}
        type={type}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="block w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default InputField;
