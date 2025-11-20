import React, { useState } from 'react'
import logo from '../assets/HealWise.png'

const Footer = () => {
  const API_BASE = import.meta.env.VITE_BACKEND_URL
  const CONTACT_ENDPOINT = '/api/contact/submit'

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState({ loading: false, ok: null, msg: '' })

  const submitForm = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, ok: null, msg: '' })

    try {
      const res = await fetch(`${API_BASE}${CONTACT_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || 'Failed to send message')
      }

      setStatus({ loading: false, ok: true, msg: 'Message sent successfully.' })
      setForm({ name: '', email: '', phone: '', message: '' })

    } catch (error) {
      setStatus({ loading: false, ok: false, msg: error.message || 'Something went wrong' })
    }
  }

  return (
    <div className="md:mx-10">
      {/* FIXED: equal width columns */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 my-10 mt-16 text-sm">

        {/* Column 1 */}
        <div>
          <img className="mb-5 w-28 sm:w-32 md:w-36 object-contain" src={logo} alt="logo" />
          <p className="w-full md:w-4/5 text-gray-600 leading-6">
            HealWise helps patients make smarter healthcare decisions by recommending
            the right doctors based on their diseases and symptoms.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <p className="text-xl font-medium mb-5">Company</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Column 3 — FIXED: reduced width + better spacing */}
        <div>
          <p className="text-xl font-medium mb-5">Get in touch</p>

          {/* Form wrapper reduces overall width */}
          <form onSubmit={submitForm} className="space-y-3 max-w-[260px]">

            <div>
              <label className="block text-sm text-gray-700 mb-1">Your name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
                
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Your email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
              
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Phone (optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
                
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Message</label>
              <textarea
                rows={3}
                required
                value={form.message}
                onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
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
                {status.loading ? 'Sending…' : 'Send message'}
              </button>

              {status.msg && (
                <span className={`text-sm ${status.ok ? 'text-green-600' : 'text-red-600'}`}>
                  {status.msg}
                </span>
              )}
            </div>

          </form>
        </div>
      </div>

      <hr />
      <p className="py-5 text-sm text-center">
        Copyright 2025 @ HealWise - All Right Reserved.
      </p>
    </div>
  )
}

export default Footer
