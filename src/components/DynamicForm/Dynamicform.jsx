import React from "react";
import { Form } from "informed";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomField from "./CustomField";
import useDynamicForm from "./hooks/useDynamicForm";
const DynamicForm = () => {
  const { formApiref, handleSubmit, initialValues, getValidationFunction, formData } =
    useDynamicForm();

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="container mx-auto">
        <ToastContainer />
        <Form
          initialValues={initialValues}
          className="space-y-8"
          focusOnInvalid={true}
          onSubmit={handleSubmit}
          formApiRef={formApiref}
        >
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
        </Form>
      </div>
    </div>
  );
};

export default DynamicForm;
