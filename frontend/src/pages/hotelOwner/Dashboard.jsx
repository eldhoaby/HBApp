import React from 'react'
import Title from '../../components/Title'

const Dashboard = () => {
  return (
    <div>
      <Title 
        align='left' 
        font='outfit' 
        title='Dashboard' 
        subTitle='Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations.' 
      />

      <div className='flex gap-4 my-8'>
        {/* ----Total Bookings-- */}
        <div>
          
        </div>
      </div>
    </div>
  )
}

export default Dashboard