import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../shared/hooks/use-form";

import { useHttp } from "../../shared/hooks/use-http";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import "./PlaceForm.css";

const NewPlace = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const { formState, inputHandler } = useForm(
    [
      {
        id: "title",
        value: "",
        isValid: false,
      },
      {
        id: "description",
        value: "",
        isValid: false,
      },
      {
        id: "address",
        value: "",
        isValid: false,
      },
      {
        id: "image",
        value: null,
        isValid: false,
      },
    ],
    false
  );

  const { isLoading, error, sendRequest, clearError } = useHttp();

  const submitHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", formState.inputs[0].value);
    formData.append("description", formState.inputs[1].value);
    formData.append("address", formState.inputs[2].value);
    formData.append("image", formState.inputs[3].value);

    try {
      await sendRequest(`${process.env.REACT_BACKEND_URL}/places`, "POST", formData, {
        Authorization: "Bearer " + authCtx.token,
      });
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={submitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          label="Title"
          type="text"
          placeholder="Title"
          id="title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <Input
          element="textarea"
          label="Description"
          type="text"
          id="description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description. (Min 5 characters)"
          onInput={inputHandler}
        />
        <Input
          label="Address"
          type="text"
          id="address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <ImageUpload center id="image" onInput={inputHandler} />
        <Button type="submit" disabled={!formState.isValid}>
          Add Place
        </Button>
      </form>
    </Fragment>
  );
};

export default NewPlace;
