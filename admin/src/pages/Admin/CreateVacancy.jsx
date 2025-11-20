import React, { useContext, useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

const CreateVacancy = () => {
  const { backendUrl, aToken } = useContext(AdminContext);
  const API = backendUrl || "http://localhost:4000";

  const [requirements, setRequirements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    specialization: "",
    location: "HealWise Noida",
    experience: "",
    vacancies: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      specialization: "",
      location: "HealWise Noida",
      experience: "",
      vacancies: "",
      description: "",
    });
    setEditingId(null);
  };

  const handleToggleForm = () => {
    setShowForm((prev) => {
      const next = !prev;
      if (!next) resetForm();
      return next;
    });
  };

  const fetchVacancies = async () => {
    try {
      const { data } = await axios.get(`${API}/api/admin/vacancies`);
      if (data.success) {
        setRequirements(
          data.data.map((v) => ({
            id: v._id,
            specialization: v.specialization,
            location: v.location,
            experience: v.experience,
            vacancies: v.vacancies,
            description: v.description,
          }))
        );
      } else {
        throw new Error(data.message || "Failed to load vacancies");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleaned = {
      specialization: formData.specialization.trim(),
      location: formData.location.trim(),
      experience: formData.experience.trim(),
      vacancies: formData.vacancies === "" ? 0 : Math.max(1, parseInt(formData.vacancies, 10) || 0),
      description: formData.description.trim(),
    };

    try {
      if (editingId) {
        const { data } = await axios.put(`${API}/api/admin/vacancies/${editingId}`, cleaned, {
          headers: { atoken: aToken },
        });
        if (!data.success) throw new Error(data.message || "Failed to update vacancy");
        toast.success("Vacancy updated");
      } else {
        const { data } = await axios.post(`${API}/api/admin/vacancies`, cleaned, {
          headers: { atoken: aToken },
        });
        if (!data.success) throw new Error(data.message || "Failed to create vacancy");
        toast.success("Vacancy created");
      }
      await fetchVacancies();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`${API}/api/admin/vacancies/${id}`, {
        headers: { atoken: aToken },
      });
      if (!data.success) throw new Error(data.message || "Failed to delete vacancy");
      toast.success("Vacancy deleted");
      await fetchVacancies();
      if (editingId === id) {
        resetForm();
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (req) => {
    setEditingId(req.id);
    setFormData({
      specialization: req.specialization || "",
      location: req.location || "HealWise Noida",
      experience: req.experience || "",
      vacancies: req.vacancies === 0 || req.vacancies ? String(req.vacancies) : "",
      description: req.description || "",
    });
    setShowForm(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create Doctor Vacancy</h1>
        <button
          onClick={handleToggleForm}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? "Close form" : "Add Requirement"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="p-2 border rounded"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              required
            >
              <option value="" disabled>Select Specialization</option>
              <option value="General Physician">General Physician</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatricians">Pediatricians</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>

            <input
              type="text"
              placeholder="Location"
              className="p-2 border rounded bg-gray-100"
              value={formData.location}
              disabled
            />

            <select
              className="p-2 border rounded"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              required
            >
              <option value="" disabled>Experience Required</option>
              <option value="1year">1year</option>
              <option value="2year">2year</option>
              <option value="3year">3year</option>
              <option value="4year">4year</option>
              <option value="5+year">5+year</option>
            </select>

            <input
              type="number"
              placeholder="Vacancies"
              className="p-2 border rounded"
              value={formData.vacancies}
              onChange={(e) => setFormData({ ...formData, vacancies: e.target.value })}
              min={1}
              step={1}
              required
            />
          </div>

          <textarea
            placeholder="Description"
            className="w-full mt-3 p-2 border rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />

          <div className="mt-3 flex gap-3">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              {editingId ? "Update" : "Submit"}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
              Reset
            </button>
          </div>
        </form>
      )}

      {requirements.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Specialization</th>
                <th className="p-3">Location</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Vacancies</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={req.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{req.specialization}</div>
                    {req.description ? (
                      <div className="text-sm text-gray-500 truncate max-w-xs" title={req.description}>
                        {req.description}
                      </div>
                    ) : null}
                  </td>
                  <td className="p-3">{req.location}</td>
                  <td className="p-3">{req.experience}</td>
                  <td className="p-3">{req.vacancies}</td>
                  <td className="p-3 flex gap-3">
                    <button onClick={() => handleEdit(req)} className="text-blue-600 hover:text-blue-800" aria-label="Edit requirement">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(req.id)} className="text-red-600 hover:text-red-800" aria-label="Delete requirement">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-10 border rounded-lg bg-white">
          No requirements yet. Click "Add Requirement" to create one.
        </div>
      )}
    </div>
  );
};

export default CreateVacancy;