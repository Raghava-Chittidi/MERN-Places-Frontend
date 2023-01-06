import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext, useEffect, Suspense } from "react";
import React from "react";

import Users from "./users/pages/Users";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";
import "./App.css";

const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./users/pages/Auth"));

let logoutTimer;

function App() {
  const { isLoggedIn, login, token, tokenExpirationDate, logout } =
    useContext(AuthContext);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (
      userData &&
      userData.token &&
      new Date(userData.expiration) > new Date()
    ) {
      login(userData.userId, userData.token, new Date(userData.expiration));
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpirationDate, logout]);

  let routes;
  if (!isLoggedIn) {
    routes = (
      <Route path="/" element={<MainNavigation />}>
        <Route index element={<Users />}></Route>
        <Route path="/auth" element={<Auth />}></Route>
        <Route path="/:userId/places" element={<UserPlaces />}></Route>
        <Route path="*" element={<Navigate to="/auth" replace />}></Route>
      </Route>
    );
  } else {
    routes = (
      <Route path="/" element={<MainNavigation />}>
        <Route index element={<Users />}></Route>
        <Route path="/:userId/places" element={<UserPlaces />}></Route>
        <Route path="/places/new" element={<NewPlace />}></Route>
        <Route path="/places/:placeId" element={<UpdatePlace />}></Route>
        <Route path="*" element={<Navigate to="/" replace />}></Route>
      </Route>
    );
  }

  const router = createBrowserRouter(createRoutesFromElements(routes));

  return (
    <Suspense
      fallback={
        <div className="center">
          <LoadingSpinner />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
