import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

const Approval = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  // Expected endpoints (adjust if your backend differs)
  const LIST_URL = `${backendUrl}/api/admin/applications`; // GET -> { success, data: [...] }
  const APPROVE_URL = (id) => `${backendUrl}/api/admin/applications/${id}/approve`; // PATCH
  const REMOVE_URL = (id) => `${backendUrl}/api/admin/applications/${id}`; // DELETE

  const [loading, setLoading] = useState(true);
  const [apps, setApps] = useState([]);
  const [previewImg, setPreviewImg] = useState(null); // image URL for modal
  const [previewResume, setPreviewResume] = useState(null); // resume URL for inline modal

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(LIST_URL, { headers: { atoken: aToken } });
      if (data.success) {
        setApps(Array.isArray(data.data) ? data.data : []);
      } else {
        toast.error(data.message || "Failed to load applications");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApprove = async (id) => {
    try {
      const { data } = await axios.patch(APPROVE_URL(id), {}, { headers: { atoken: aToken } });
      if (data.success) {
        toast.success("Application approved");
        // Optimistic local update so Reject button hides immediately
        setApps(prev => prev.map(a => a._id === id ? { ...a, status: 'accepted' } : a));
        // Optionally refresh from server for latest data (resume/status consistency)
        // fetchApplications();
      } else {
        toast.error(data.message || "Approval failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Approval failed");
    }
  };

  const onReject = async (id) => {
    if (!window.confirm("Reject this application?")) return;
    try {
      const { data } = await axios.delete(REMOVE_URL(id), { headers: { atoken: aToken } });
      if (data.success) {
        toast.success(data.message || "Application rejected");
        setApps((prev) => prev.map(a => a._id === id ? { ...a, status: 'rejected' } : a));
      } else {
        toast.error(data.message || "Rejection failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Rejection failed");
    }
  };

  const fmtDate = (d) => {
    try {
      return new Date(d).toLocaleDateString('en-GB'); // dd/mm/yyyy
    } catch {
      return "-";
    }
  };

  // Inline resume preview: we'll open a modal and embed PDF on this page

  const StatusBadge = ({ status }) => {
    const s = (status || "submitted").toLowerCase();
    const color =
      s === "accepted"
        ? "bg-green-100 text-green-700"
        : s === "reviewed"
        ? "bg-blue-100 text-blue-700"
        : s === "rejected"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700";
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${color}`}>
        {s}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Job Applications</h1>
        <div className="text-sm text-gray-600">
          Total: <span className="font-medium">{apps.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded border bg-white p-4 shadow-sm animate-pulse">
              <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-1/3 bg-gray-200 rounded mb-4" />
              <div className="h-24 w-full bg-gray-100 rounded mb-4" />
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="py-14 text-center text-gray-600">
          No applications yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {apps.map((a) => (
            <div key={a._id} className="rounded border bg-white p-4 shadow-sm">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold">{a.name || "-"}</h2>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="text-xs text-gray-500">
                    Applied: {fmtDate(a.createdAt)}
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium">
                    {a.vacancy?.specialization || "-"}
                  </div>
                  <div className="text-gray-500">
                    {a.vacancy?.location || "-"}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="mt-3 rounded bg-gray-50 p-3 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div>
                    <div className="text-gray-500">Age</div>
                    <div className="font-medium">{a.age ?? "-"}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Phone</div>
                    <div className="font-medium">{a.phone || "-"}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-gray-500">Email</div>
                    <div className="font-medium break-all">{a.email || "-"}</div>
                  </div>
                </div>

                {a.additionalInfo ? (
                  <div className="mt-3">
                    <div className="text-gray-500">Additional Info</div>
                    <div className="whitespace-pre-line">{a.additionalInfo}</div>
                  </div>
                ) : null}
              </div>

              {/* Files */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {a.profileImageUrl ? (
                  <button
                    onClick={() => setPreviewImg(a.profileImageUrl)}
                    className="rounded border px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50"
                    title="View Profile Image"
                  >
                    View Profile Image
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">No Profile Image</span>
                )}
                {a.resumeUrl ? (
                  <button
                    type="button"
                    onClick={() => setPreviewResume(`${backendUrl}/api/admin/applications/${a._id}/resume?atoken=${encodeURIComponent(aToken)}&ts=${Date.now()}`)}
                    className="rounded border px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50"
                    title="Open Resume PDF"
                  >
                    Open Resume
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">No Resume</span>
                )}
              </div>

              {/* Actions: show both only while submitted */}
              <div className="mt-4 flex items-center justify-end gap-2">
                {a.status === 'submitted' && (
                  <>
                    <button
                      onClick={() => onApprove(a._id)}
                      className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(a._id)}
                      className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                {a.status === 'accepted' && (
                  <span className="text-sm font-medium text-green-700">Approved</span>
                )}
                {a.status === 'rejected' && (
                  <span className="text-sm font-medium text-red-700">Rejected</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image preview modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewImg(null)}
        >
          <div
            className="bg-white max-w-3xl w-full rounded shadow-lg p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Profile Image</h3>
              <button
                onClick={() => setPreviewImg(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto">
              <img
                src={previewImg}
                alt="Profile"
                className="mx-auto h-auto max-w-full rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Resume preview modal */}
      {previewResume && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewResume(null)}
        >
          <div
            className="bg-white w-full max-w-5xl rounded shadow-lg p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">Resume</h3>
              <button
                onClick={() => setPreviewResume(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close resume preview"
              >
                ✕
              </button>
            </div>
            <div className="h-[80vh] w-full">
              <object data={previewResume} type="application/pdf" className="h-full w-full" aria-label="Resume PDF">
                <iframe src={previewResume} className="h-full w-full" title="Resume PDF" />
                <div className="p-3 text-sm text-gray-600">
                  Unable to display the PDF.
                  <a href={previewResume} target="_blank" rel="noreferrer" className="text-blue-600 underline ml-1">
                    Open/Download
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approval;