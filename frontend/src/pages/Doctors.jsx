import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const[showFilter,setshowFilter]=useState(false);
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, speciality]);

  return (
    <div className="">
      <p className='text-gray-700'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter? 'bg-[#5f6FFF] text-white border-transparent' :'border-gray-300'}`} onClick={()=>setshowFilter(prev=>!prev)}>Filters</button>
        <div className={`flex-col gap-3 text-sm text-gray-700 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p
            onClick={() =>
              speciality?.trim() === 'General physician'
                ? navigate('/doctors')
                : navigate('/doctors/General physician')
            }
            className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer ${
              speciality?.trim() === 'General physician' ? 'bg-indigo-100 text-black border-indigo-200' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            General physician
          </p>

          <p
            onClick={() =>
              speciality?.trim() === 'Gynecologist'
                ? navigate('/doctors')
                : navigate('/doctors/Gynecologist')
            }
            className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer ${speciality?.trim() === 'Gynecologist' ? 'bg-indigo-100 text-black border-indigo-200' : 'border-gray-300 hover:bg-gray-50'}`}>
            Gynecologist
          </p>

          <p
            onClick={() =>
              speciality?.trim() === 'Dermatologist'
                ? navigate('/doctors')
                : navigate('/doctors/Dermatologist')
            }
            className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer ${
              speciality?.trim() === 'Dermatologist' ? 'bg-indigo-100 text-black border-indigo-200' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Dermatologist
          </p>

          <p
            onClick={() =>
              speciality?.trim() === 'Pediatricians'
                ? navigate('/doctors')
                : navigate('/doctors/Pediatricians')
            }
            className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer ${
              speciality?.trim() === 'Pediatricians' ? 'bg-indigo-100 text-black border-indigo-200' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pediatricians
          </p>

          <p
            onClick={() =>
              speciality?.trim() === 'Neurologist'
                ? navigate('/doctors')
                : navigate('/doctors/Neurologist')
            }
            className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer ${
              speciality?.trim() === 'Neurologist' ? 'bg-indigo-100 text-black border-indigo-200' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Neurologist
          </p>

          <p
            onClick={() =>
              speciality?.trim() === 'Gastroenterologist'
                ? navigate('/doctors')
                : navigate('/doctors/Gastroenterologist')
            }
            className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer ${
              speciality?.trim() === 'Gastroenterologist' ? 'bg-indigo-100 text-black border-indigo-200' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Gastroenterologist
          </p>
        </div>

  <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 md:gap-6'>
          {filterDoc.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(`/appointment/${item._id}`)}
              className='group flex flex-col border border-blue-200 rounded-xl overflow-hidden cursor-pointer bg-white hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md'
            >
              <img 
                className='bg-blue-50 w-full h-48 object-cover' 
                src={item.image} 
                alt={item.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Doctor+Image';
                }}
              />
              <div className='p-4 flex-1'>
                <div className={`mt-1 flex items-center gap-2 text-sm ${item.available ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className={`inline-block w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <span>{item.available ? 'Available' : 'Not Available'}</span>
                </div>
                <p className='text-gray-900 text-base md:text-lg font-medium mt-2'>
                  {item.name}
                </p>
                <p className='text-gray-600 text-sm'>
                  {item.speciality}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
