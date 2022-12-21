import React from 'react'
import ItemTopChartDoctor from './ItemTopChartDoctor'

export default function TopChartDoctor({BenhNhan,count}) {
  return (
    <div style={{display : 'flex' , gap  : '10px' , padding : '10px' , alignItems : 'center'}}>
        <ItemTopChartDoctor color="#6B6BFF" title='Tổng Doanh thu' number={count} icon={<i style={{fontSize : '25px'}} className="fa-solid fa-dollar-sign"></i>}/>
        <ItemTopChartDoctor color="#F7401B" title='Bệnh nhân' number={BenhNhan} icon={<i style={{fontSize : '25px'}} className="fa-solid fa-people-group"></i>}/>

    </div>
  )
}
