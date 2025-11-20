import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const MyApplications = () => {
  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const { token } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);
  const [error, setError] = useState('');
  const [previewResume, setPreviewResume] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchApplications = async () => {
    if (!token) {
      setError('Please log in to view your applications.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/user/my-applications`, {
        headers: { token }
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to load applications');
      }
      setApps(data.data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    if (!token) return;
    // Polling interval to update statuses (accepted / rejected)
    const interval = setInterval(() => {
      fetchApplications();
    }, 15000); // 15s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-GB'); // dd/mm/yyyy
    } catch {
      return '-';
    }
  };

  const StatusBadge = ({ status }) => {
    const s = (status || 'submitted').toLowerCase();
    const styles = {
      submitted: 'bg-gray-100 text-gray-700',
      reviewed: 'bg-blue-100 text-blue-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[s] || styles.submitted}`}>
        {s}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Applications</h1>

      {loading && (
        <div className="py-10 text-center text-gray-600">
          Loading your applications...
        </div>
      )}

      {!loading && error && (
        <div className="py-10 text-center text-red-600">{error}</div>
      )}

      {!loading && !error && apps.length === 0 && (
        <div className="py-10 text-center text-gray-600">
          You haven&apos;t applied to any vacancies yet.
        </div>
      )}

      {!loading && !error && apps.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {apps.map((app) => (
            <div key={app._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {app.vacancy?.specialization || 'Unknown Role'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {app.vacancy?.location || 'Location N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Applied: {formatDate(app.createdAt)}
                  </p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              {app.additionalInfo && (
                <p className="mt-3 text-gray-700 whitespace-pre-line">
                  {app.additionalInfo}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded border text-blue-700 hover:bg-blue-50"
                  onClick={() => setPreviewResume(app.resumeUrl)}
                >
                  View Resume
                </button>
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded border text-gray-700 hover:bg-gray-50"
                >
                  Download Resume
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewImage(app.profileImageUrl)}
                  className="px-3 py-1.5 rounded border text-gray-700 hover:bg-gray-50"
                >
                  View Profile Image
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Refresh */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={fetchApplications}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Refreshing...' : 'Refresh Status'}
        </button>
      </div>

      {/* Resume Preview Modal */}
      {previewResume && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewResume(null)}
        >
          <div
            className="bg-white w-full max-w-4xl rounded shadow-lg p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Resume Preview</h3>
              <button
                onClick={() => setPreviewResume(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="h-[75vh] w-full">
              <object
                data={previewResume}
                type="application/pdf"
                className="w-full h-full"
              >
                <iframe
                  title="Resume PDF"
                  src={previewResume}
                  className="w-full h-full"
                />
                <div className="p-3 text-sm text-gray-600">
                  Unable to display PDF.
                  <a
                    href={previewResume}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline ml-1"
                  >
                    Open
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}

      {/* Profile Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white w-full max-w-3xl rounded shadow-lg p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Profile Image</h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto">
              <img src={previewImage} alt="Profile" className="mx-auto h-auto max-w-full rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;