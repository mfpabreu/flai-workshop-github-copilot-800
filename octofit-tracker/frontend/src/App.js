import React from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

const features = [
  { icon: '👤', title: 'Users',       desc: 'Manage athlete profiles and fitness goals.',   to: '/users' },
  { icon: '🏃', title: 'Activities',  desc: 'Log and review completed fitness activities.', to: '/activities' },
  { icon: '🏆', title: 'Leaderboard', desc: 'See who is leading the competition.',          to: '/leaderboard' },
  { icon: '👥', title: 'Teams',       desc: 'Create and manage competitive teams.',         to: '/teams' },
  { icon: '💪', title: 'Workouts',    desc: 'Browse personalised workout suggestions.',     to: '/workouts' },
];

function HomePage() {
  return (
    <div className="mt-4">
      <div className="octofit-hero text-center">
        <h1>🐙 Welcome to OctoFit Tracker</h1>
        <p className="lead">
          Track workouts, compete on leaderboards, and crush your fitness goals with your team.
        </p>
        <Link className="btn btn-light btn-lg mt-2 px-4 fw-semibold" to="/leaderboard">
          View Leaderboard
        </Link>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
        {features.map((f) => (
          <div className="col" key={f.title}>
            <div className="card feature-card h-100">
              <div className="card-body text-center py-4">
                <div className="feature-icon">{f.icon}</div>
                <h5 className="card-title fw-bold">{f.title}</h5>
                <p className="card-text text-muted">{f.desc}</p>
              </div>
              <div className="card-footer bg-transparent border-0 text-center pb-3">
                <Link className="btn btn-primary btn-sm px-4" to={f.to}>
                  Go to {f.title}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">🐙 OctoFit Tracker</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} to="/users">
                  👤 Users
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} to="/activities">
                  🏃 Activities
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} to="/teams">
                  👥 Teams
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} to="/leaderboard">
                  🏆 Leaderboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} to="/workouts">
                  💪 Workouts
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users"       element={<Users />} />
          <Route path="/activities"  element={<Activities />} />
          <Route path="/teams"       element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts"    element={<Workouts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
