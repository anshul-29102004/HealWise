import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext)
  const { currency } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      }

      const { data } = await axios.post(
        backendUrl + '/api/doctor/update-Profile',
        updateData,
        { headers: { dToken } }
      )

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (dToken && !isEdit) {
      getProfileData()
    }
  }, [dToken, isEdit, getProfileData])

  return (
    profileData && (
      <div className="p-5 sm:p-10 flex flex-col lg:flex-row gap-10">

        {/* LEFT — DOCTOR IMAGE */}
        <div className="w-full lg:w-1/3 flex justify-center">
          <img
            className="w-full max-w-xs rounded-xl shadow-md border bg-indigo-50"
            src={profileData.image}
            alt="Doctor"
          />
        </div>

        {/* RIGHT — DETAILS CARD */}
        <div className="flex-1 bg-white shadow-md border rounded-xl p-6 sm:p-8 relative">

          {/* ⭐ TOP-RIGHT EDIT / SAVE BUTTON */}
          {!isEdit ? (
            <button
              onClick={() => setIsEdit(true)}
              className="absolute top-5 right-5 px-4 py-1.5 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={updateProfile}
              className="absolute top-5 right-5 px-4 py-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
            >
              Save
            </button>
          )}

          {/* NAME */}
          <h1 className="text-3xl font-semibold text-gray-800 mt-2">
            {profileData.name}
          </h1>

          {/* DEGREE + SPECIALITY */}
          <div className="flex items-center flex-wrap gap-3 mt-2 text-gray-600">
            <p className="text-lg font-medium">
              {profileData.degree} — {profileData.speciality}
            </p>
            <span className="py-1 px-3 bg-indigo-100 text-indigo-600 text-xs rounded-full font-medium">
              {profileData.experience}
            </span>
          </div>

          {/* ABOUT */}
          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-800">About:</p>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              {profileData.about}
            </p>
          </div>

          {/* FEES */}
          <div className="mt-6 text-gray-700 font-medium">
            Appointment fee:
            <span className="ml-2 text-gray-900 font-semibold">
              {currency}
              {isEdit ? (
                <input
                  type="number"
                  className="border rounded-md px-2 py-1 ml-2 text-sm w-24"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: Number(e.target.value),
                    }))
                  }
                />
              ) : (
                profileData.fees
              )}
            </span>
          </div>

          {/* ADDRESS */}
          <div className="mt-6">
            <p className="text-gray-700 font-medium mb-1">Address</p>

            <div className="text-sm text-gray-600">
              {isEdit ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    className="border rounded-md px-3 py-2 w-full"
                    value={profileData.address.line1}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />

                  <input
                    type="text"
                    className="border rounded-md px-3 py-2 w-full"
                    value={profileData.address.line2}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                </div>
              ) : (
                <>
                  <p>{profileData.address.line1}</p>
                  <p>{profileData.address.line2}</p>
                </>
              )}
            </div>
          </div>

          {/* AVAILABILITY */}
          <div className="flex items-center gap-2 mt-5">
            <input
              type="checkbox"
              checked={profileData.available}
              onChange={() =>
                isEdit &&
                setProfileData((prev) => ({
                  ...prev,
                  available: !prev.available,
                }))
              }
              className="w-4 h-4 accent-indigo-600"
            />
            <label className="text-gray-700 font-medium">Available</label>
          </div>
        </div>
      </div>
    )
  )
}

export default DoctorProfile
