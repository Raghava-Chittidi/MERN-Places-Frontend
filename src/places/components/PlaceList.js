import { useParams } from "react-router-dom";
import { useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceList.css";

const PlaceList = (props) => {
  const authCtx = useContext(AuthContext);
  const userId = useParams().userId;

  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          {userId !== authCtx.userId ? (
            <h2>No places have been added.</h2>
          ) : (
            <h2>No places have been added. Maybe create one?</h2>
          )}
          {userId === authCtx.userId && (
            <Button to="/places/new">Share Place</Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDelete}
        ></PlaceItem>
      ))}
    </ul>
  );
};

export default PlaceList;
