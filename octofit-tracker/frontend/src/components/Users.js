import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  useEffect(() => {
    console.log('Users: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Users: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setUsers(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Users: fetch error', err);
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
        <p className="fw-semibold">Loading users...</p>
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
        <h2 className="mb-0">👤 Users</h2>
        <span className="badge bg-light text-dark">{users.length} users</span>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Team</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">No users found.</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id || index}>
                    <td className="text-muted">{index + 1}</td>
                    <td><span className="fw-semibold">👤 {user.name}</span></td>
                    <td>
                      <a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a>
                    </td>
                    <td>{user.team || <span className="text-muted">—</span>}</td>
                    <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</td>
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

export default Users;
