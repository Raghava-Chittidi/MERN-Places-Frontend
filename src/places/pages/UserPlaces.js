import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttp } from "../../shared/hooks/use-http";

import PlaceList from "../components/PlaceList";

const UserPlaces = () => {
  const userId = useParams().userId;
  const [userPlaces, setUserPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttp();

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_BACKEND_URL}places/user/${userId}`
        );
        setUserPlaces(data.places);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserPlaces();
  }, [sendRequest, userId]);

  const deletePlaceHandler = (placeId) => {
    setUserPlaces((prevState) =>
      prevState.filter((place) => placeId !== place.id)
    );
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && userPlaces && (
        <PlaceList items={userPlaces} onDelete={deletePlaceHandler} />
      )}
    </Fragment>
  );
};

export default UserPlaces;
