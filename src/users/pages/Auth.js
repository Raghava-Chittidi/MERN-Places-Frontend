import { Fragment, useContext, useState } from "react";

import Button from "../../shared/components/FormElements/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/use-form";
import { useHttp } from "../../shared/hooks/use-http";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./Auth.css";

const Auth = () => {
  const authCtx = useContext(AuthContext);
  const [loginMode, setLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const { formState, inputHandler, setFormState } = useForm(
    [
      {
        id: "email",
        value: "",
        isValid: false,
      },
      {
        id: "password",
        value: "",
        isValid: false,
      },
    ],
    false
  );

  const switchModeHandler = () => {
    if (loginMode) {
      setFormState(
        [
          {
            id: "name",
            value: "",
            isValid: false,
          },
          ...formState.inputs,
          {
            id: "image",
            value: null,
            isValid: false,
          },
        ],
        false
      );
    } else {
      formState.inputs.shift();
      formState.inputs.pop();
      setFormState(
        [...formState.inputs],
        formState.inputs[0].isValid && formState.inputs[1].isValid
      );
    }
    setLoginMode((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (loginMode) {
      try {
        const data = await sendRequest(
          `${process.env.REACT_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs[0].value,
            password: formState.inputs[1].value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        authCtx.login(data.user.userId, data.user.token);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs[0].value);
        formData.append("email", formState.inputs[1].value);
        formData.append("password", formState.inputs[2].value);
        formData.append("image", formState.inputs[3].value);
        const data = await sendRequest(
          `${process.env.REACT_BACKEND_URL}/users/signup`,
          "POST",
          formData
        );

        authCtx.login(data.user.userId, data.user.token);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{loginMode ? "Login Required" : "Signup"}</h2>
        <hr />
        <form onSubmit={submitHandler}>
          {!loginMode ? (
            <Input
              label="Name"
              type="text"
              placeholder="Name"
              id="name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid name."
              onInput={inputHandler}
            />
          ) : (
            ""
          )}
          {!loginMode && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
            />
          )}
          <Input
            label="Email"
            type="email"
            placeholder="Email"
            id="email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Password"
            id="password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password. (Min 6 characters)"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {loginMode ? "Login" : "Signup"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Switch to {loginMode ? "Signup" : "Login"}?
        </Button>
      </Card>
    </Fragment>
  );
};

export default Auth;
