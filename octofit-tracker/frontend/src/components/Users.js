import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', team: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const baseUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
    : 'http://localhost:8000';

  const apiUrl = `${baseUrl}/api/users/`;
  const teamsUrl = `${baseUrl}/api/teams/`;

  const fetchUsers = () => {
    return fetch(apiUrl)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => Array.isArray(data) ? data : data.results || []);
  };

  useEffect(() => {
    Promise.all([
      fetchUsers(),
      fetch(teamsUrl).then((r) => r.ok ? r.json() : []).then((d) => Array.isArray(d) ? d : d.results || []),
    ])
      .then(([usersData, teamsData]) => {
        setUsers(usersData);
        setTeams(teamsData);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name || '', email: user.email || '', team: user.team || '' });
    setSaveError(null);
  };

  const closeEdit = () => { setEditUser(null); setSaveError(null); };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    setSaveError(null);
    const userId = editUser._id;
    fetch(`${apiUrl}${userId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editForm.name, email: editForm.email, team: editForm.team }),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((d) => { throw new Error(JSON.stringify(d)); });
        return r.json();
      })
      .then(() => fetchUsers())
      .then((updated) => { setUsers(updated); setSaving(false); closeEdit(); })
      .catch((err) => { setSaveError(err.message); setSaving(false); });
  };

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
    <>
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
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">No users found.</td>
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
                      <td className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openEdit(user)}
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">✏️ Edit User — {editUser.name}</h5>
                <button type="button" className="btn-close" onClick={closeEdit} aria-label="Close" />
              </div>
              <div className="modal-body">
                {saveError && (
                  <div className="alert alert-danger py-2">{saveError}</div>
                )}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={editForm.name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={editForm.email}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Team</label>
                  <select
                    className="form-select"
                    name="team"
                    value={editForm.team}
                    onChange={handleFormChange}
                  >
                    <option value="">— No Team —</option>
                    {teams.map((t) => (
                      <option key={t._id || t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEdit} disabled={saving}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Users;


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
