import React from "react";
import { useField } from "informed";

const RadioGroup = ({ field, validate }) => {
  const { id, label, options, required } = field;
  const {
    fieldState: { value, error },
    fieldApi: { setValue },
    ref,
  } = useField({
    name: id,
    validate,
    validateOn: "change",
  });

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-3">
            <input
              name={id}
              ref={ref}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={() => setValue(option.value)}
              className="h-5 w-5 accent-blue-500"
            />
            <span className="text-sm text-gray-600">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default RadioGroup;
