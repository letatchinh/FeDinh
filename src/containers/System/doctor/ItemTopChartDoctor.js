import React from 'react'

export default function ItemTopChartDoctor({title,number,icon,color}) {
  return (
    <div style={{width : '20%' , display : 'flex' , justifyContent : 'space-between' , padding : '20px' , boxShadow : '0 0 1px 1px #999' , alignItems  : 'center' ,borderRadius : '10px'}}>
        <div>
            <p style={{color : color}}>{title}</p>
            <p style={{fontWeight : '600' , fontSize : '18px'}}>{number}</p>
        </div>
        {icon}
    </div>
  )
}
