import React from 'react';
import Title from './Title';
import { testimonials } from '../assets/assets';
import StarRating from './StarRating';

const Testimonial = () => {
    return (
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 
        pt-12 pb-30">
        <Title title="What our guests say" subTitle="Discover why discerning 
       travelers consistently choose HomyStay for their exclusive and luxurious 
      accommodations." />
       <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
         {testimonials.map((testimonial) => (
           <div key={testimonial.id} className="bg-white p-6 rounded-xl 
             shadow ">
                <div className="mt-4 flex items-center gap-3">
  <img className="rounded-full w-12 h-12" src={testimonial.image} />
  <div>
    <p className="text-sm font-playfair">{testimonial.name}</p>
    <p className="text-gray-500 text-sm">{testimonial.address}</p>
  </div>
</div>
<div className="flex items-center gap-1 mt-4">
  <StarRating/>
</div>
<p className="text-gray-500 max-w-90 mt-4">"{testimonial.review}"</p>
</div>
 ))}
</div>
</div>
 )
}

export default Testimonial