import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Basic session persistence via localStorage for this Name + PIN flow
        const savedAdmin = localStorage.getItem('admin_session');
        if (savedAdmin) {
            setAdmin(JSON.parse(savedAdmin));
        }
        setLoading(false);
    }, []);

    const login = async (name, pin) => {
        try {
            console.log('--- ADMIN LOGIN AUDIT ---');
            console.log('Payload:', { name, pin });

            // Security Hardening: Validating against DB via Secure RPC.
            const { data, error } = await supabase
                .rpc('verify_user_credentials', {
                    p_name: name,
                    p_pin: pin,
                    p_role: 'admin'
                })
                .maybeSingle();

            if (error) throw new Error(`Database error: ${error.message}`);

            if (!data) {
                throw new Error('Invalid credentials or unauthorized access');
            }

            setAdmin(data);
            localStorage.setItem('admin_session', JSON.stringify(data));
            return data;
        } catch (err) {
            console.error('Audit Conclusion: Login failed.', err.message);
            throw err;
        }
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem('admin_session');
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
