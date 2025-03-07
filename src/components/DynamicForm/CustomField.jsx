import React from "react";
import InputField from "./InputField";
import TextareaField from "./TextareaField";
import SelectField from "./SelectField";
import RadioGroup from "./RadioGroup";
import CheckboxGroup from "./CheckboxGroup";
import FileInput from "./FileInput";
import Checkbox from "./Checkbox";

const CustomField = ({ field, validate }) => {
  const { type } = field;
  switch (type) {
    case "radio":
      return (
        <div className="mt-6">
          <RadioGroup field={field} validate={validate} />
        </div>
      );
    case "checkbox-group":
      return (
        <div className="mt-6">
          <CheckboxGroup field={field} validate={validate} />
        </div>
      );
    case "file":
      return (
        <div className="mt-6">
          <FileInput field={field} validate={validate} />
        </div>
      );
    case "checkbox":
      return (
        <div className="mt-6">
          <Checkbox field={field} validate={validate} />
        </div>
      );
    case "select":
      return (
        <div className="mt-6">
          <SelectField field={field} validate={validate} />
        </div>
      );
    case "textarea":
      return (
        <div className="mt-6">
          <TextareaField field={field} validate={validate} />
        </div>
      );
    default:
      return (
        <div className="mt-6">
          <InputField field={field} validate={validate} />
        </div>
      );
  }
};

export default CustomField;
