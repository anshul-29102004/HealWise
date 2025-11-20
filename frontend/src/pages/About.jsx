import React from 'react'
import about_image from '../assets/aboutus_frontend.png'
const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center text-3xl pt-10 text-gray-600 font-semibold tracking-wide">
        <h1 className="leading-tight">ABOUT <span className="text-gray-800 font-bold">US</span></h1>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-10 md:gap-16 my-12 items-center">
        <div className="flex flex-col justify-center gap-6 md:w-1/2 text-base text-gray-700">
          <p>
            We understand how stressful managing your health can be — that’s why HealWise is here to help.
            Our platform empowers you to book appointments, consult the right specialists, and store your medical records safely, so you can focus on what truly matters — your well-being.
          </p>
          <p>
            HealWise blends technology with compassion to deliver excellence in healthcare.
            We’re continuously improving our platform to enhance convenience, accessibility, and care — ensuring support every step of the way.
          </p>
          <b className="text-gray-800 text-lg">Our Vision</b>
          <p>
            HealWise envisions a future where technology transforms healthcare into a seamless experience.
            By uniting patients and providers on one smart platform, we aim to make personalized, timely, and accessible care the new standard.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <div className="relative w-full max-w-lg mx-auto aspect-4/3 rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200">
            <img
              src={about_image}
              alt="About HealWise"
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="text-2xl my-8 text-center font-semibold">
        <p>WHY <span className="text-gray-700 font-bold">CHOOSE US</span></p>
      </div>

      <div className="grid gap-8 mb-24 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {[
          { title: 'EFFICIENCY', body: 'Book appointments effortlessly — anytime, anywhere, on your schedule.' },
          { title: 'CONVENIENCE', body: 'Trusted doctors. Nearby care. Just a click away.' },
          { title: 'PERSONALIZATION', body: 'Get smart health tips and timely reminders that help you stay healthy and informed.' }
        ].map(card => (
          <div key={card.title} className="relative group border rounded-xl px-8 md:px-10 py-8 flex flex-col gap-4 text-base bg-white shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold tracking-wide text-gray-800 group-hover:text-[#5f6FFF]">{card.title}:</h3>
            <p className="text-gray-600 group-hover:text-gray-700 text-sm leading-relaxed">{card.body}</p>
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-[#5f6FFF]/0 via-[#5f6FFF]/0 to-[#5f6FFF]/0 group-hover:from-[#5f6FFF]/5 group-hover:to-[#5f6FFF]/10 transition" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default About