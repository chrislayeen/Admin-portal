import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Bot,
    ChevronRight,
    ShieldCheck,
    BarChart3,
    User,
    Menu
} from 'lucide-react';

const Layout = ({ children }) => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { id: 'records', label: 'Session Records', icon: <FileText size={20} />, path: '/records' },
        { id: 'analytics', label: 'Analytics Center', icon: <BarChart3 size={20} />, path: '/analytics' },
        { id: 'settings', label: 'User Management', icon: <Settings size={20} />, path: '/settings' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--slate-50)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'var(--slate-900)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100,
                borderRight: '1px solid var(--slate-800)'
            }}>
                <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ padding: '8px', background: 'var(--primary)', borderRadius: '10px' }}>
                        <Bot size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.025em' }}>LOGISTICS</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>Admin Portal</div>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '16px 12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 12px',
                                        borderRadius: 'var(--radius-md)',
                                        color: isActive ? 'white' : 'var(--slate-400)',
                                        background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                                        textDecoration: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        transition: 'all 150ms ease'
                                    }}
                                >
                                    <span style={{ color: isActive ? 'white' : 'inherit' }}>{item.icon}</span>
                                    {item.label}
                                    {isActive && <div style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }} />}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div style={{ padding: '20px', borderTop: '1px solid var(--slate-800)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'white',
                            border: '1px solid var(--slate-700)',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
                {/* Top Header */}
                <header style={{
                    height: '64px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid var(--slate-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '0 32px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-900)' }}>{admin?.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>System Administrator</div>
                        </div>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'var(--slate-100)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--slate-600)',
                            border: '1px solid var(--slate-200)'
                        }}>
                            <User size={20} />
                        </div>
                    </div>
                </header>

                <main style={{ flex: 1, padding: '32px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;

