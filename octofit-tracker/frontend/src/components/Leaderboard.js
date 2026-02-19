import React, { useState, useEffect } from 'react';

const rankMedal = (index) => {
  if (index === 0) return <span className="rank-gold" title="Gold">🥇</span>;
  if (index === 1) return <span className="rank-silver" title="Silver">🥈</span>;
  if (index === 2) return <span className="rank-bronze" title="Bronze">🥉</span>;
  return <span className="text-muted">{index + 1}</span>;
};

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  useEffect(() => {
    console.log('Leaderboard: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Leaderboard: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setEntries(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard: fetch error', err);
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
        <p className="fw-semibold">Loading leaderboard...</p>
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

  return (
    <div className="card mt-4">
      <div className="card-header octofit-card-header d-flex align-items-center justify-content-between">
        <h2 className="mb-0">🏆 Leaderboard</h2>
        <span className="badge bg-light text-dark">{entries.length} athletes</span>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th className="text-center" style={{ width: '80px' }}>Rank</th>
                <th>User</th>
                <th>Team</th>
                <th className="text-end">Total Calories</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">No entries found.</td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <tr key={entry._id || index} className={index === 0 ? 'table-warning' : ''}>
                    <td className="text-center fs-5">{rankMedal(index)}</td>
                    <td><span className="fw-semibold">{entry.user_name}</span></td>
                    <td>{entry.team || 'N/A'}</td>
                    <td className="text-end">
                      <span className="badge bg-success octofit-badge fs-6">{entry.total_calories}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
