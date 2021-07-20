import React from 'react';
import { KeycloakInstance, KeycloakProfile } from 'keycloak-js';
import { Auth, AuthContext } from '@bf2/ui-shared';
import { getKeyCloakToken, getParsedKeyCloakToken } from './keycloakAuth';

// This is a context which can manage the keycloak
export interface IKeycloakContext {
  keycloak?: KeycloakInstance | undefined;
  profile?: KeycloakProfile | undefined;
}

export const KeycloakContext = React.createContext<IKeycloakContext>({
  keycloak: undefined,
});

export const KeycloakAuthProvider: React.FunctionComponent = props => {
  const getUsername = () => {
    return getParsedKeyCloakToken().then((token: any) => token['username']);
  };

  const authTokenContext = {
    kas: {
      getToken: getKeyCloakToken,
    },
    getUsername: getUsername,
  } as Auth;
  return (
    <AuthContext.Provider value={authTokenContext}>
      {props.children}
    </AuthContext.Provider>
  );
};