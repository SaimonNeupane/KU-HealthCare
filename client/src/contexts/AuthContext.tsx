import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { GetUserInfo, LoginAPI } from "../utils/api";
import { toast } from "sonner";

interface User {
  username: string;
  email: string;
  role: string;
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
  role?: string;
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
  role: undefined,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  const login = async ({ email, password }: LoginData) => {
    const toastId = toast.loading("Logging in...");
    try {
      const response = await LoginAPI({ email, password });

      if (response.status === 200) {
        const newToken = response.data.token;
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setIsAuthenticated(true);

        toast.success("Login successful!", { id: toastId });
        return response;
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(`Login failed: ${err.response.data.message}`, {
          id: toastId,
        });
        throw err.response;
      } else {
        toast.error("An unexpected error occurred.", { id: toastId });
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

    const response = await GetUserInfo();
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
    refetchInterval: 40 * 1000,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const username = userData?.username;
  const email = userData?.email;
  const role = userData?.role;

  useEffect(() => {
    if (autherr) {
      logout();
    }
  }, [autherr]);

  return (
    <AuthContext.Provider
      value={{ login, logout, isAuthenticated, username, email, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
