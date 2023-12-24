import {
  useMemo,
  useEffect,
  useReducer,
  useCallback,
  createContext,
} from 'react';

import { setSession, tokenExpired } from './utils';
import { httpPost } from '../utils/axios';
import { User } from '../interface/user';

interface LoginState {
  user: User | null;
  loading: boolean;
}

interface LoginAction {
  type: 'INITIAL' | 'LOGIN' | 'LOGOUT';
  payload: {
    user: User | null;
  };
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: User | null;
  method: string;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (
    identifier: string,
    password: string,
    callback?: () => void,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: LoginState = {
  user: null,
  loading: true,
};

const reducer = (state: LoginState, action: LoginAction) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  method: 'jwt',
  loading: false,
  authenticated: false,
  unauthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    dispatch({
      type: 'INITIAL',
      payload: {
        user: null,
      },
    });
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(
    async (identifier: string, password: string, callback?: () => void) => {
      const data = {
        identifier,
        password,
      };

      const { jwt: accessToken, user } = await httpPost(
        '/api/auth/local',
        data,
      );

      setSession(accessToken, callback);

      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            ...user,
            accessToken,
          },
        },
      });
    },
    [],
  );

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
      payload: {
        user: null,
      },
    });
  }, []);

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      logout,
    }),
    [login, logout, state.user, status],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
