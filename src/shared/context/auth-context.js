import React, { useCallback, useState } from "react";

export const AuthContext = React.createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  tokenExpirationDate: new Date(),
  login: (userId, token) => {},
  logout: () => {},
});

const AuthContextProvider = (props) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const login = useCallback((userId, token, expiration) => {
    setUserId(userId);
    setToken(token);
    const tokenExpiration =
      expiration || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpiration);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        token: token,
        expiration: tokenExpiration.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    setTokenExpirationDate(null)
    localStorage.removeItem("userData");
  }, []);

  const context = {
    isLoggedIn: !!token,
    userId: userId,
    token: token,
    tokenExpirationDate: tokenExpirationDate,
    login: login,
    logout: logout,
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
