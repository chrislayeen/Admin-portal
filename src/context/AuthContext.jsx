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

            // Requirement: Admin name can be anything, but PIN must be 884876
            if (pin === '884876') {
                const adminData = {
                    name: name || 'System Admin',
                    role: 'admin',
                    id: 'internal-' + Date.now()
                };

                console.log('Audit Result: ACCESS GRANTED (Override PIN)');
                setAdmin(adminData);
                localStorage.setItem('admin_session', JSON.stringify(adminData));
                return adminData;
            }

            // Fallback to DB check for other admins (optional, but keeping for robustness)
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .ilike('name', name)
                .eq('pin', pin)
                .eq('role', 'admin')
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
