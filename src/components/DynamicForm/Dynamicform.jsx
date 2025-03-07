import React, { useRef } from "react";
import { Form } from "informed";
import formData from "./formData.json"; // Your form fields configuration
import CustomField from "./CustomField"; // Your custom field component
import {
  validateDefaultField,
  validateRadio,
  validateCheckboxGroup,
  validateFile,
  validateSimpleCheckbox,
} from "./validations"; // Your validation functions

const getValidationFunction = (field) => {
  const { type, label, required, id } = field;
  switch (type) {
    case "radio":
      return validateRadio({ label, required });
    case "checkbox-group":
      return validateCheckboxGroup({ label, required });
    case "file":
      return validateFile({ label, required });
    case "checkbox":
      return validateSimpleCheckbox({ label, required });
    default:
      return validateDefaultField({ label, required, type, id });
  }
};

// Set initial values
const initialValues = formData.reduce((acc, field) => {
  if (field.type === "checkbox-group") {
    acc[field.id] = [];
  } else if (field.type === "checkbox") {
    acc[field.id] = false;
  } else {
    acc[field.id] = "";
  }
  return acc;
}, {});

const DynamicForm = () => {
  const formApiref = useRef();
  const handleSubmit = (values) => {
    console.log(formApiref.current);
    console.log("Form values:", values);
    formApiref.current.reset();
  };

  return (
    <div className=" bg-gray-50 py-8 px-4">
      <div className="container mx-auto ">
        <Form
          initialValues={initialValues}
          className="space-y-8"
          focusOnInvalid={true}
          onSubmit={handleSubmit}
          formApiRef={formApiref}
        >
          {({ formApi, formState }) => (
            <div>
              {formData.map((field) => (
                <CustomField
                  key={field.id}
                  field={field}
                  validate={getValidationFunction(field)}
                />
              ))}
              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Application
              </button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default DynamicForm;
