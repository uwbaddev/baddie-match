import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, BarChart3, Home, Menu, PencilLine, User, X } from 'lucide-react';
import '../index.css'

const Header = () => {
    const [expanded, setExpanded] = useState(false);
    const closeMenu = () => setExpanded(false);
    const navItems = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/report', label: 'Report Match', icon: PencilLine },
        { to: '/results', label: 'Results', icon: BarChart3 },
        { to: '/elo', label: 'Rankings', icon: ArrowUpRight },
        { to: '/players', label: 'Roster', icon: User },
    ];

    return (
        <>
            <header className="site-header">
                <Link to="/" className="brand-lockup" onClick={closeMenu}>
                    <img src="/warriors_logo.png" alt="" />
                    <span>Varsity Badminton</span>
                </Link>
                <nav className="desktop-nav" aria-label="Primary">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            {item.label === 'Roster' ? 'Players' : item.label}
                        </NavLink>
                    ))}
                </nav>
                <button
                    className="menu-button"
                    type="button"
                    aria-label="Open menu"
                    onClick={() => setExpanded(true)}
                >
                    <Menu size={22} />
                </button>
            </header>
            {expanded && (
                <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Main menu">
                    <div className="mobile-menu-panel">
                        <div className="mobile-menu-brand">
                            <img src="/warriors_logo.png" alt="" />
                            <span>
                                <strong>Varsity Badminton</strong>
                                <small>TEAM STATISTICS</small>
                            </span>
                        </div>
                        <nav aria-label="Mobile primary">
                            {navItems.map(item => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        onClick={closeMenu}
                                        className={({ isActive }) => isActive ? 'active' : ''}
                                    >
                                        <Icon size={17} />
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </nav>
                        <button className="mobile-menu-close" type="button" aria-label="Close menu" onClick={closeMenu}>
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header;
