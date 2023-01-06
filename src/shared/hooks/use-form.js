import { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let updatedInputs;
      let formIsValid = true;
      for (const input of state.inputs) {
        if (input.id === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && input.isValid;
        }
      }

      updatedInputs = [...state.inputs];
      const index = state.inputs.findIndex(
        (input) => input.id === action.inputId
      );
      updatedInputs[index] = {
        ...updatedInputs[index],
        value: action.value,
        isValid: action.isValid,
      };
      return {
        ...state,
        inputs: [...updatedInputs],
        isValid: formIsValid,
      };
    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.isValid,
      };
    default:
      return state;
  }
};

export const useForm = (formInputs, formValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: formInputs,
    isValid: formValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      inputId: id,
      value: value,
      isValid: isValid,
    });
  }, []);

  const setFormState = useCallback((formInputs, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: formInputs,
      isValid: formValidity,
    });
  }, []);

  return { formState, inputHandler, setFormState };
};
