import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoginAPI } from "../utils/api";

interface User {
  username: string;
  email: string;
  profilePic: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  login: ({ email, password }: LoginData) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  username?: string;
  email?: string;
  profilePic?: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  username: undefined,
  email: undefined,
  profilePic: undefined,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  const login = async ({ email, password }: LoginData) => {
    try {
      const response = await LoginAPI({ email, password });
      if (response.status === 200) {
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setIsAuthenticated(true);
        return response;
      }
    } catch (err: any) {
      if (err.response) {
        throw err.response;
      } else {
        throw new Error("An unexpected error occurred.");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
  };

  const validateToken = async (): Promise<User> => {
    if (!token) {
      throw new Error("No token available");
    }

    const response = await axios.get("http://localhost:3000/user/getinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setIsAuthenticated(true);
    }
    console.log(response.data);
    return response.data;
  };

  const { data: userData, error: autherr } = useQuery<User>({
    queryKey: ["validate"],
    queryFn: validateToken,
    enabled: !!token,
    refetchInterval: 4 * 1000,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const username = userData?.username;
  const email = userData?.email;

  useEffect(() => {
    if (autherr) {
      logout();
    }
  }, [autherr]);

  return (
    <AuthContext.Provider
      value={{ login, logout, isAuthenticated, username, email }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
