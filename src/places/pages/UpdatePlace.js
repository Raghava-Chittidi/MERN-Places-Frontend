import { useParams } from "react-router-dom";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useNavigate } from "react-router-dom";
import { Fragment, useContext, useEffect, useState } from "react";

import { useForm } from "../../shared/hooks/use-form";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useHttp } from "../../shared/hooks/use-http";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceForm.css";

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const [place, setPlace] = useState();
  const { formState, setFormState, inputHandler } = useForm();
  const { isLoading, error, sendRequest, clearError } = useHttp();

  useEffect(() => {
    const fetchSinglePlace = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setPlace(data.place);
        setFormState(
          [
            {
              id: "title",
              value: data.place.title,
              isValid: true,
            },
            {
              id: "description",
              value: data.place.description,
              isValid: true,
            },
          ],
          true
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchSinglePlace();
  }, [sendRequest, placeId, setFormState]);

  const updateFormHandler = async (event) => {
    event.preventDefault();

    const body = {
      title: formState.inputs[0].value,
      description: formState.inputs[1].value,
    };

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify(body),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );
      navigate(`/${authCtx.userId}/places`, { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  if (!isLoading && !place && !error) {
    return (
      <div className="center">
        <h2>Could not find place!</h2>
      </div>
    );
  }

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && place && (
        <form className="place-form" onSubmit={updateFormHandler}>
          {isLoading && <LoadingSpinner asOverlay />}
          <Input
            label="Title"
            type="text"
            placeholder="Title"
            id="title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            value={formState.inputs[0].value}
            isValid={formState.inputs[0].isValid}
          />
          <Input
            element="textarea"
            label="Description"
            type="text"
            id="description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description. (Min 5 characters)"
            onInput={inputHandler}
            value={formState.inputs[1].value}
            isValid={formState.inputs[1].isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Edit Place
          </Button>
        </form>
      )}
    </Fragment>
  );
};

export default UpdatePlace;
