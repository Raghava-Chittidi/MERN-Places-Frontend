import { Fragment, useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttp } from "../../shared/hooks/use-http";
import UsersList from "../components/UsersList";

const Users = () => {
  const [users, setUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttp();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
        setUsers(data.users);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && <UsersList items={users} />}
    </Fragment>
  );
};

export default Users;
