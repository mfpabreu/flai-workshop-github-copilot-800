import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  useEffect(() => {
    console.log('Teams: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Teams: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setTeams(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="octofit-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="fw-semibold">Loading teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center mt-4" role="alert">
        <strong>Error:&nbsp;</strong> {error}
      </div>
    );
  }

  const getMembers = (members) => {
    if (!members) return [];
    return Array.isArray(members) ? members : String(members).split(',').map((m) => m.trim());
  };

  return (
    <div className="card mt-4">
      <div className="card-header octofit-card-header d-flex align-items-center justify-content-between">
        <h2 className="mb-0">👥 Teams</h2>
        <span className="badge bg-light text-dark">{teams.length} teams</span>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Team Name</th>
                <th>Members</th>
                <th className="text-center">Size</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">No teams found.</td>
                </tr>
              ) : (
                teams.map((team, index) => {
                  const memberList = getMembers(team.members);
                  return (
                    <tr key={team._id || index}>
                      <td className="text-muted">{index + 1}</td>
                      <td><span className="fw-semibold">{team.name}</span></td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {memberList.map((m, i) => (
                            <span key={i} className="badge bg-secondary octofit-badge">{m}</span>
                          ))}
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-info text-dark octofit-badge">{memberList.length}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Teams;
