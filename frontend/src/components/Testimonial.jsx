import React from 'react';
import Title from './Title';
import { testimonials } from '../assets/assets';
import StarRating from './StarRating';

const Testimonial = () => {
    return (
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 dark:bg-gray-900/60 pt-12 pb-30 transition-colors duration-300">
        <Title title="What our guests say" subTitle="Discover why discerning travelers consistently choose HomyStay for their exclusive and luxurious accommodations." />
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700/50 p-6 rounded-xl shadow transition duration-300">
              <div className="mt-4 flex items-center gap-3">
                <img className="rounded-full w-12 h-12" src={testimonial.image} alt={testimonial.name} />
                <div>
                  <p className="text-sm font-playfair text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4">
                <StarRating/>
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-90 mt-4">"{testimonial.review}"</p>
            </div>
          ))}
        </div>
      </div>
    )
}

export default Testimonial