import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.jpg'
import doc2 from './doc2.jpeg'
import doc3 from './doc3.jpeg'
import doc4 from './doc4.jpg'
import doc5 from './doc5.jpeg'
import doc6 from './doc6.jpeg'
import doc7 from './doc7.jpeg'
import doc8 from './doc8.jpeg'
import doc9 from './doc9.jpeg'
import doc10 from './doc10.png'
import doc11 from './doc11.jpeg'
import doc12 from './doc12.jpg'
import doc13 from './doc13.jpeg'
import doc14 from './doc14.jpeg'
import doc15 from './doc15.jpg'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Naresh Trehan',
        image: doc1,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Naresh Trehan is dedicated to providing holistic healthcare that emphasizes preventive care, timely diagnosis, and advanced treatment approaches.',
        fees: 500,
        address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Vinod Raina',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Vinod Raina is dedicated to providing holistic healthcare that emphasizes prevention, timely diagnosis, and advanced treatment solutions to ensure the best patient outcomes.',
        fees: 600,
        address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Randhir Sud',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Randhir Sud is dedicated to providing patient-centered healthcare, with a strong focus on preventive medicine, early detection, and advanced treatment methods to promote long-term well-being.',
        fees: 1500,
        address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Sandeep Vaishya',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr.Randhir Sud has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 1000,
        address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc5',
        name: 'Prof. Dr. Mohamed Rela',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Prof. Dr. Mohamed Rela is devoted to providing exceptional and holistic healthcare, with a strong emphasis on preventive medicine, early detection, and advanced treatment techniques to enhance patient well-being.',
        fees: 900,
       address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Ravinder Gera',
        image: doc6,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 1300,
        address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Vikram Kalra',
        image: doc7,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Vikram Kalra is committed to providing holistic and compassionate medical care, emphasizing preventive health measures, timely diagnosis, and advanced treatment approaches to ensure patient wellness.',
        fees: 500,
        address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Shilpa Ghosh',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Shilpa Ghosh is dedicated to providing compassionate and comprehensive healthcare, emphasizing preventive medicine, early detection, and effective treatment strategies to ensure the best outcomes for her patients. Dr. Davis is committed to delivering holistic medical care, focusing on prevention, accurate diagnosis, and advanced therapeutic approaches for overall well-being.',
        fees: 800,
        address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Vivek Vij',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Vivek Vij is dedicated to providing comprehensive and patient-centered healthcare, emphasizing preventive medicine, early detection, and advanced treatment approaches to ensure better health outcomes. Dr.Vivek Jij is devoted to offering holistic medical care, focusing on prevention, timely diagnosis, and effective therapeutic solutions for overall well-being.',
        fees: 2000,
       address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Hitesh Garg',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Hitesh Garg is devoted to offering complete and patient-focused medical care, emphasizing preventive healthcare, timely diagnosis, and advanced treatment methods to ensure lasting wellness. Dr. Davis is committed to providing holistic and high-quality medical services, focusing on prevention, early detection, and effective therapeutic strategies for optimal patient outcomes.',
        fees: 400,
       address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Inderjit Singh Parmar',
        image: doc11,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Inderjit Singh Parmar is dedicated to delivering holistic and patient-centered healthcare, with a strong emphasis on preventive medicine, early diagnosis, and advanced treatment approaches to promote long-term well-being.Dr. Inderjit Singh Parmar is devoted to providing comprehensive medical care, focusing on prevention, timely detection, and effective therapeutic solutions for improved patient outcomes.',
        fees: 1200,
        address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: doc12,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Patrick Harris is dedicated to delivering patient-focused and well-rounded healthcare, highlighting the importance of preventive medicine, early detection, and modern treatment approaches that foster lasting health.Dr. Patrick Harris is passionate about providing integrated medical care, prioritizing prevention, accurate diagnosis, and innovative therapeutic solutions to enhance patient outcomes.',
        fees: 700,
        address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Ravi Bhatia',
        image: doc13,
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Ravi Bhatia has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.Dr. Ravi Bhatia has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 300,
        address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Col Rajagopal A',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Col Rajagopal A is dedicated to delivering holistic and patient-centered healthcare, emphasizing preventive medicine, early diagnosis, and effective treatment approaches that promote long-term well-being. With a steadfast commitment to excellence, Dr. Col Rajagopal A focuses on combining medical expertise with compassionate care to achieve the best possible outcomes for his patients.',
        fees: 60,
       address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Shakti Bhan Khanna',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '9 Years',
        about: 'Dr. Shakti Bhan Khanna has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.Dr. Shakti Bhan Khanna has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 3000,
        address: {
            line1: 'HealWise',
            line2: 'Noida'
        }
    },
]