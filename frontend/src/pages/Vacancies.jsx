import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Vacancies = () => {
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [vacancies, setVacancies] = useState([]);
    const [applyOpen, setApplyOpen] = useState(false);
    const [appliedIds, setAppliedIds] = useState(new Set());
  const [activeVacancy, setActiveVacancy] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    additionalInfo: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [resumePdf, setResumePdf] = useState(null);
  const profileRef = useRef(null);
  const resumeRef = useRef(null);
  const [fileErrors, setFileErrors] = useState({ profile: "", resume: "" });

  const MAX_IMAGE_BYTES = 1 * 1024 * 1024; // 1MB
  const MAX_RESUME_BYTES = 2 * 1024 * 1024; // 2MB

  const loadVacancies = async () => {
    setLoading(true);
    try {
      // This expects GET /api/admin/vacancies to be public
      const res = await fetch(`${API}/api/admin/vacancies`);
      const data = await res.json();
      if (data.success) {
        setVacancies(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch vacancies");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch vacancies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVacancies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    useEffect(() => {
      // Fetch applications of current user to disable already applied vacancies
      const tokenLS = localStorage.getItem('token');
      if (tokenLS) {
        fetch('/api/user/my-applications', {
          headers: { 'Content-Type': 'application/json', token: tokenLS }
        })
          .then(res => res.json())
          .then(data => {
            if (data?.success && Array.isArray(data.data)) {
              const ids = new Set(data.data.map(app => app?.vacancy?._id).filter(Boolean));
              setAppliedIds(ids);
            }
          })
          .catch(err => console.error('failed to load user applications', err));
      }
    }, []);

  const openApply = (vacancy) => {
    // New client-side guard for already applied vacancies
    if (appliedIds.has(vacancy._id)) {
      toast.error('You have already applied for this role');
      return;
    }
    if (!token) {
      toast.info("Please log in to apply");
      navigate("/login");
      return;
    }
    setActiveVacancy(vacancy);
    setForm({ name: "", email: "", age: "", phone: "", additionalInfo: "" });
    setProfileImage(null);
    setResumePdf(null);
    setFileErrors({ profile: "", resume: "" });
    if (profileRef.current) profileRef.current.value = "";
    if (resumeRef.current) resumeRef.current.value = "";
    setApplyOpen(true);
  };

  const closeApply = () => {
    setApplyOpen(false);
    setActiveVacancy(null);
  };

  const onProfileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setProfileImage(null);
      setFileErrors((s) => ({ ...s, profile: "" }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      if (profileRef.current) profileRef.current.value = "";
      setProfileImage(null);
      setFileErrors((s) => ({
        ...s,
        profile: "Invalid file type. Please upload an image (JPG/PNG).",
      }));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Profile image must be 1 MB or smaller");
      if (profileRef.current) profileRef.current.value = "";
      setProfileImage(null);
      setFileErrors((s) => ({
        ...s,
        profile: "Profile image too large. Upload up to 1 MB.",
      }));
      return;
    }
    setProfileImage(file);
    setFileErrors((s) => ({ ...s, profile: "" }));
  };

  const onResumeChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setResumePdf(null);
      setFileErrors((s) => ({ ...s, resume: "" }));
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF resume");
      if (resumeRef.current) resumeRef.current.value = "";
      setResumePdf(null);
      setFileErrors((s) => ({
        ...s,
        resume: "Invalid file type. Please upload a PDF.",
      }));
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      toast.error("Resume must be 2 MB or smaller");
      if (resumeRef.current) resumeRef.current.value = "";
      setResumePdf(null);
      setFileErrors((s) => ({
        ...s,
        resume: "Resume too large. Upload up to 2 MB.",
      }));
      return;
    }
    setResumePdf(file);
    setFileErrors((s) => ({ ...s, resume: "" }));
  };

  const removeProfile = () => {
    setProfileImage(null);
    if (profileRef.current) profileRef.current.value = "";
  };

  const removeResume = () => {
    setResumePdf(null);
    if (resumeRef.current) resumeRef.current.value = "";
  };

  const isValid = useMemo(() => {
    const emailOk = /.+@.+\..+/.test(form.email.trim());
    const ageNum = parseInt(form.age, 10);
    const phoneOk = /[0-9]{7,}/.test(form.phone.trim());
    return (
      form.name.trim() &&
      emailOk &&
      !Number.isNaN(ageNum) &&
      ageNum > 0 &&
      phoneOk &&
      profileImage instanceof File &&
      resumePdf instanceof File
    );
  }, [form, profileImage, resumePdf]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!activeVacancy) return;

    if (!isValid) {
      toast.error("Please fill all required fields and attach files");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("vacancyId", activeVacancy._id || activeVacancy.id);
      fd.append("name", form.name.trim());
      fd.append("email", form.email.trim());
      fd.append("age", form.age);
      fd.append("phone", form.phone.trim());
      fd.append("additionalInfo", form.additionalInfo.trim());
      fd.append("profileImage", profileImage);
      fd.append("resume", resumePdf);

      // Your backend route is under /api/user/:id/apply (with authUser)
      const target = `${API}/api/user/${activeVacancy._id || activeVacancy.id}/apply`;
      const res = await fetch(target, {
        method: "POST",
        body: fd,
        headers: token ? { token } : undefined
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Submission failed");
      }
      toast.success("Application submitted");
      // Optimistically add vacancy to appliedIds set
      setAppliedIds(prev => {
        const copy = new Set(prev);
        copy.add(activeVacancy._id || activeVacancy.id);
        return copy;
      });
      closeApply();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to submit application");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Current Vacancies</h1>
      {loading ? (
        <div className="py-10 text-center text-gray-600">
          Loading vacancies...
        </div>
      ) : vacancies.length === 0 ? (
        <div className="py-10 text-center text-gray-600">
          No current vacancies.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {vacancies.map((v) => (
            <div
              key={v._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{v.specialization}</h2>
                  <p className="text-sm text-gray-600">
                    {v.location} • {v.experience}
                  </p>
                  <p className="text-sm text-gray-600">
                    Openings: {v.vacancies}
                  </p>
                </div>
              </div>
              {v.description && (
                <p className="mt-3 text-gray-700 whitespace-pre-line">
                  {v.description}
                </p>
              )}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => openApply(v)}
                  className={`px-4 py-2 rounded text-white ${appliedIds.has(v._id) ? 'bg-gray-600 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {appliedIds.has(v._id) ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      {applyOpen && activeVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                Apply for {activeVacancy.specialization}
              </h3>
              <button
                onClick={closeApply}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="p-2 border rounded"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="p-2 border rounded"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  className="p-2 border rounded"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  min={1}
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  className="p-2 border rounded"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />

                <div className="md:col-span-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    Profile Image (JPG/PNG)
                  </label>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <label className="px-3 py-2 border rounded cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <span>Select Image</span>
                        <input
                          ref={profileRef}
                          type="file"
                          accept="image/*"
                          onChange={onProfileChange}
                          className="hidden"
                          required={!profileImage}
                        />
                      </label>
                    </div>
                    {profileImage ? (
                      <div className="flex items-center justify-between gap-2 w-full rounded border bg-gray-50 px-2 py-1">
                        <span
                          title={profileImage.name}
                          className="text-sm text-gray-700 flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                          {profileImage.name}
                        </span>
                        <button
                          type="button"
                          onClick={removeProfile}
                          className="shrink-0 text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        No file selected
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Max 1 MB. JPG/PNG only.
                    </div>
                    {fileErrors.profile && (
                      <div className="text-xs text-red-600" aria-live="polite">
                        {fileErrors.profile}
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm text-gray-600 mb-1">
                    Resume (PDF)
                  </label>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <label className="px-3 py-2 border rounded cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <span>Select PDF</span>
                        <input
                          ref={resumeRef}
                          type="file"
                          accept="application/pdf"
                          onChange={onResumeChange}
                          className="hidden"
                          required={!resumePdf}
                        />
                      </label>
                    </div>
                    {resumePdf ? (
                      <div className="flex items-center justify-between gap-2 w-full rounded border bg-gray-50 px-2 py-1">
                        <span
                          title={resumePdf.name}
                          className="text-sm text-gray-700 flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                          {resumePdf.name}
                        </span>
                        <button
                          type="button"
                          onClick={removeResume}
                          className="shrink-0 text-red-600 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        No file selected
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Max 2 MB. PDF only.
                    </div>
                    {fileErrors.resume && (
                      <div className="text-xs text-red-600" aria-live="polite">
                        {fileErrors.resume}
                      </div>
                    )}
                  </div>
                </div>

                <textarea
                  placeholder="Additional information (cover letter, links, etc.)"
                  className="md:col-span-2 p-2 border rounded min-h-28"
                  value={form.additionalInfo}
                  onChange={(e) =>
                    setForm({ ...form, additionalInfo: e.target.value })
                  }
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeApply}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`px-4 py-2 rounded text-white ${
                    isValid
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vacancies;