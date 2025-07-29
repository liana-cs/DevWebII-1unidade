import React from 'react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './header.css';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
     <header className="header">
      <div className="container">
        <div className="header-toolbar">
          <h1 className="header-logo" onClick={() => navigate('/')}>
            Wing Bytes 
          </h1> 
          
          <nav className="header-nav">
            <button className="header-btn" onClick={() => navigate('/')}>
              <span className="icon icon-home"></span>
              <span className="">Home</span>
            </button>
            
            {user ? (
              <>
                <button className="header-btn" onClick={() => navigate('/create-post')}>
                  <span className="icon icon-add"></span>
                  <span className="">New Post</span>
                </button>
                <button className="header-btn" onClick={() => navigate('/profile')}>
                  <span className="icon icon-person"></span>
                  <span className="">Profile</span>
                </button>
                <button className="header-btn" onClick={handleLogout}>
                  <span className="icon icon-logout"></span>
                  <span className="">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button className="header-btn" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button className="header-btn" onClick={() => navigate('/register')}>
                  Register
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;