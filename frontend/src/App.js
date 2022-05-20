import React, { useEffect, useState, memo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'react-toastify/dist/ReactToastify.css';
// import Routes from './routes/Routes'
// import { ToastContainer } from 'react-toastify';
// import { ProductNotification, socket } from './socket/product'
import Notifier from "react-desktop-notification"
import useSortAndFilter from './components/global/sortAndFilter'
import Table from 'react-bootstrap/Table'


const tempTableData = //[3,4,6,2,1,5,7]
[
  {id:2,name:'shyam',price: { car: { newVal: { oldVal: 1 }} }},
  {id:1,name:'ram',price: { car: { newVal: { oldVal: 30000000000 }} } },
  {id:7,name:'rahul',price: { car: { newVal: { oldVal: '89' }} }},
  {id:3,name:'pooja',price: { car: { newVal: { oldVal: 500000000000 }} }},
  {id:6,name:'rani',price: { car: { newVal: { oldVal: 6000000000 }} }},
  {id:5,name:'jhon',price: { car: { newVal: { oldVal: 500 }} }},
  {id:4,name:'karina',price: { car: { newVal: { oldVal: 400 }} }},
]

function TempTable(){
  const [data,setData] = useState(tempTableData)
  const { sort, search } = useSortAndFilter(data)


  useEffect(()=>{
    let r = search('price.car.newVal.oldVal', 0)
      console.log('r = ',r);
    setData(
      r
      // sort('$$array',1)
      // sort('price.car.newVal.oldVal',1)
      // price.car.newVal.oldVal
    )
  },[])

  return(
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item,index)=>(
          <tr key={index}>
            {/* <td>{item}</td> */}
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.price.car.newVal.oldVal}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}



function App() {
  
  // handleProduct Notifications
  const handleNotification = (data) => {
      // current user socket id
      console.log('product notification = ',data)
      Notifier.start(//start
        "Product Update",
        "product id:- "+data.id,
         window.location.origin,
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
      );
  }

  useEffect(()=>{
    // const socket = ProductNotification(handleNotification)

    // return ()=>{
    //   socket()
    // }
  },[])

  return (
    <>
      <TempTable />
      {/* <ToastContainer />
      <Routes /> */}
    </>
  );
}

export default App;
