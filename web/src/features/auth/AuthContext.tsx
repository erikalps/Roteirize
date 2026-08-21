import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router';
import api from '../../services/api';


interface User {
    id: string,
    name: string,
    email: string,
    createdAt: string
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkout() {
            const token = localStorage.getItem('roteirize_token')
           

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/auth/me')
                setUser(response.data)
            } catch {
                localStorage.removeItem('roteirize_token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkout();

    }, []);


    function login(token: string, user: User) {
        localStorage.setItem('roteirize_token', token);
        setUser(user);
    }

    function logout() {
        localStorage.removeItem('roteirize_token');
        setUser(null);
        navigate('/login');
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
    // eslint-disable-next-line react-refresh/only-export-components
    export function useAuth() {
        const context = useContext(AuthContext);
        if (!context) {
            throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
        }
        return context;
    }
