import React, { useState } from "react";

const Footer = () => {
  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const CONTACT_ENDPOINT = "/api/contact/submit";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, ok: null, msg: "" });

  const submitForm = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, ok: null, msg: "" });

    try {
      const res = await fetch(`${API_BASE}${CONTACT_ENDPOINT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Failed to send message");
      }

      setStatus({ loading: false, ok: true, msg: "Message sent successfully." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setStatus({
        loading: false,
        ok: false,
        msg: error.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="md:mx-10">
      {/* 3-column footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 my-16 items-start md:items-stretch">

        {/* Column 1 */}
        <div className="h-full flex flex-col space-y-3">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            Why HealWise?
          </h3>

          <ul className="list-disc marker:text-indigo-500 pl-5 space-y-2 text-gray-600">
            <li>Verified Doctors</li>
            <li>AI-powered recommendations</li>
            <li>Zero-cost suggestions</li>
            <li>Secure patient data</li>
            <li>24/7 Support</li>
          </ul>
        </div>

        {/* Column 2 (Company) - matched styling to Why HealWise? */}
        <div className="h-full flex flex-col space-y-3">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">Company</h3>

          <ul className="list-disc marker:text-indigo-500 pl-5 space-y-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Security & Data Protection</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="h-full flex flex-col">
          <p className="text-xl font-medium mb-5">Get in touch</p>

          <form onSubmit={submitForm} className="space-y-3 max-w-[260px]">

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Your name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Your email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Phone (optional)
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows={3}
                required
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 resize-none"
                placeholder="How can we help?"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={status.loading}
                className="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status.loading ? "Sending…" : "Send message"}
              </button>

              {status.msg && (
                <span
                  className={`text-sm ${
                    status.ok ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status.msg}
                </span>
              )}
            </div>
          </form>

          <div className="grow"></div>
        </div>
      </div>

      <hr />
      <p className="py-5 text-sm text-center">
        Copyright 2025 @ HealWise - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
