import React from 'react';
export const AuthenticationContext = React.createContext();

export function AuthenticationProvider(props) {
  const [authentication, setAuthentication] = React.useState(false);
  return (
    <AuthenticationContext.Provider value={[authentication, setAuthentication]}>
      {props.children}
    </AuthenticationContext.Provider>
  );
}
