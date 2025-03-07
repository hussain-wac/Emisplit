import React from "react";
import { useField } from "informed";

const Checkbox = ({ field, validate }) => {
  const { id, label, required } = field;
  const {
    fieldState: { value, error },
    fieldApi: { setValue },
    ref,
  } = useField({
    name: id,
    type: "checkbox",
    validate,
    validateOn: "change",
  });

  const handleChange = (e) => {
    setValue(e.target.checked);
  };

  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <input
          name={id}
          ref={ref}
          type="checkbox"
          required={required}
          checked={!!value}
          onChange={handleChange}
          className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        <span>{label}</span>
      </label>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default Checkbox;
