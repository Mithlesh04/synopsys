import React from 'react';
import { Breadcrumb as BsBreadcrumb} from 'react-bootstrap'

import { useLocation } from 'react-router-dom'

function Breadcrumb(){
    const location = useLocation();
    const locations = location.pathname.split('/');
    return (
        <BsBreadcrumb style={{ padding: 20 }}>
            <BsBreadcrumb.Item href="/">Home</BsBreadcrumb.Item>
            {
                locations.map((loc,index) => {
                    if(loc){
                        return (
                            <BsBreadcrumb.Item key={index} active={ !locations[index+1] } href={`${locations.slice(0,index+1).join('/')}`} style={{ textTransform: 'capitalize'}}>
                                {loc.replace(/-/g, ' ')}
                            </BsBreadcrumb.Item>
                        )
                    }
                })
            }
        </BsBreadcrumb>
    )
}

export default Breadcrumb;