import React, { useState } from "react";
import "./Header.css";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <header className="header">
      <div className="header-container">
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
          <span className="menu-icon"></span>
        </button>

        <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive("/")}`}>
                홈
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/inputnum"
                className={`nav-link ${isActive("/inputnum")}`}
              >
                번호등록
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/savevideo"
                className={`nav-link ${isActive("/savevideo")}`}
              >
                저장된 영상 보기
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
