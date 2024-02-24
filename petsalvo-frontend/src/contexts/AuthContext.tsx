'use client'

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { ReactNode, createContext, useContext } from 'react';

interface AuthContextProps {
  signIn: (accessToken: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const signIn = async (accessToken: string) => {

    const decodedToken: any = jwtDecode(accessToken);
    const expirationTimeInSeconds = decodedToken.exp;
    const expirationDate = new Date(expirationTimeInSeconds * 1000);

    Cookies.set('accessToken', accessToken, { expires: expirationDate });
  };

  const signOut = () => {
    Cookies.remove('accessToken');
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
