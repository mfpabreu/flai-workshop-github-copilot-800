import React, { useState, useEffect } from 'react';

const difficultyBadge = (level) => {
  if (!level) return <span className="badge bg-secondary octofit-badge">—</span>;
  const l = String(level).toLowerCase();
  if (l === 'easy')   return <span className="badge badge-easy octofit-badge">Easy</span>;
  if (l === 'medium') return <span className="badge badge-medium octofit-badge">Medium</span>;
  if (l === 'hard')   return <span className="badge badge-hard octofit-badge">Hard</span>;
  return <span className="badge bg-secondary octofit-badge">{level}</span>;
};

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  useEffect(() => {
    console.log('Workouts: fetching from', apiUrl);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Workouts: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        setWorkouts(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
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
        <p className="fw-semibold">Loading workouts...</p>
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
        <h2 className="mb-0">💪 Workouts</h2>
        <span className="badge bg-light text-dark">{workouts.length} workouts</span>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Workout Name</th>
                <th>Category</th>
                <th>Description</th>
                <th className="text-center">Duration (min)</th>
                <th className="text-center">Cal/Session</th>
                <th className="text-center">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {workouts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">No workouts found.</td>
                </tr>
              ) : (
                workouts.map((workout, index) => (
                  <tr key={workout._id || index}>
                    <td className="text-muted">{index + 1}</td>
                    <td><span className="fw-semibold">{workout.name}</span></td>
                    <td><span className="badge bg-info text-dark">{workout.category || '—'}</span></td>
                    <td className="text-muted">{workout.description}</td>
                    <td className="text-center">{workout.duration}</td>
                    <td className="text-center">{workout.calories_per_session ?? '—'}</td>
                    <td className="text-center">{difficultyBadge(workout.difficulty)}</td>
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

export default Workouts;
