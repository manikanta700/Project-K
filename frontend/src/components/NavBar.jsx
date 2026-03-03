import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/collection", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* ── Main NavBar ───────────────────────────────── */}
      <nav
        className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-0 py-4 bg-[#faf8f4] transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-none"
          }`}
      >
        {/* Logo */}
        <Link to="/">
          <img src={assets.logo} className="w-32 sm:w-36" alt="Logo" />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden sm:flex gap-8 text-sm font-medium text-gray-700">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 transition-colors hover:text-[#2d7a4f] ${isActive ? "text-[#2d7a4f]" : ""
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{label.toUpperCase()}</span>
                    <span
                      className={`block h-0.5 w-4 rounded-full bg-[#2d7a4f] transition-all duration-300 ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                        }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-5">
          {/* Search */}
          <button
            onClick={() => setShowSearch(true)}
            className="p-1.5 rounded-full hover:bg-[#e8f5ee] transition-colors"
            aria-label="Search"
          >
            <img src={assets.search_icon} className="w-5" alt="Search" />
          </button>

          {/* Profile */}
          <div className="group relative">
            <button
              onClick={() => (token ? null : navigate("/login"))}
              className="p-1.5 rounded-full hover:bg-[#e8f5ee] transition-colors"
              aria-label="Profile"
            >
              <img className="w-5" src={assets.profile_icon} alt="Profile" />
            </button>
            {token && (
              <div className="hidden group-hover:block absolute right-0 pt-3 z-50">
                <div className="flex flex-col gap-1 w-44 py-3 px-4 bg-white shadow-xl rounded-xl border border-gray-100 text-gray-600 text-sm">
                  <p className="px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#e8f5ee] hover:text-[#2d7a4f] transition-colors">
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/orders")}
                    className="px-2 py-1.5 rounded-lg cursor-pointer hover:bg-[#e8f5ee] hover:text-[#2d7a4f] transition-colors"
                  >
                    My Orders
                  </p>
                  <hr className="my-1" />
                  <p
                    onClick={logout}
                    className="px-2 py-1.5 rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative p-1.5 rounded-full hover:bg-[#e8f5ee] transition-colors">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
            {getCartCount() > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-[#2d7a4f] text-white text-[9px] font-bold rounded-full">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setVisible(true)}
            className="sm:hidden p-1.5 rounded-lg hover:bg-[#e8f5ee] transition-colors"
            aria-label="Open menu"
          >
            <img src={assets.menu_icon} className="w-5" alt="Menu" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer Backdrop ──────────────────────── */}
      <div
        onClick={() => setVisible(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* ── Mobile Drawer ──────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out sm:hidden ${visible ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link to="/" onClick={() => setVisible(false)}>
            <img src={assets.logo} className="w-28" alt="Logo" />
          </Link>
          <button
            onClick={() => setVisible(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 text-xl font-light"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              onClick={() => setVisible(false)}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 font-medium text-sm transition-colors ${isActive
                  ? "bg-[#e8f5ee] text-[#2d7a4f]"
                  : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="px-4 py-5 border-t border-gray-100">
          {token ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { navigate("/orders"); setVisible(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                📦 My Orders
              </button>
              <button
                onClick={() => { logout(); setVisible(false); }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => { navigate("/login"); setVisible(false); }}
              className="btn-primary w-full"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
