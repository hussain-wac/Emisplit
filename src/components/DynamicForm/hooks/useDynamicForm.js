// useDynamicForm.js
import { useRef } from "react";
import { toast } from "react-toastify";
import formData from "../formData.json";
import {
  validateDefaultField,
  validateRadio,
  validateCheckboxGroup,
  validateFile,
  validateSimpleCheckbox,
} from "../validations";

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

const useDynamicForm = () => {
  const formApiref = useRef();

  const handleSubmit = ({values}) => {
    console.log("Form values:", values);
    formApiref.current.reset();

    toast.success("Form submitted successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return { formApiref, handleSubmit, initialValues, getValidationFunction, formData };
};

export default useDynamicForm;