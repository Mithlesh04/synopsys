import CreateProducts from './../components/products/CreateProducts';
import ViewProducts from './../components/products/ViewProducts';
import Breadcrumb from './../components/global/Breadcrumb';

import {
    BrowserRouter,
    Routes,
    Route,
    Link
  } from "react-router-dom";

  
function Product(){
    return(
       <>
           <ul style={{listStyle:'none'}}>
               <li> <Link to="/product/create-products">create-products</Link></li>
               <li> <Link to="/product/view-products">view-products</Link></li>
           </ul>
       </> 
    )
}

function Home(){
    return(
        <>
            <Link to="/product">Go to product</Link>
        </>
    )
}

function NoMatch(){
    return(
        <h4 style={{ textAlign: 'center', margin: '10px auto' }}>
            404 Invalid URL
        </h4>
    )
}

  
function MainRoutes() {
    return (
        <>
            <BrowserRouter>
                <Breadcrumb />

                <Routes>
                    <Route path="*" element={<NoMatch />} />
                    <Route path="/" element={<Home />} />
                    <Route exact path="/product" caseSensitive={false} element={<Product />} />
                    <Route exact caseSensitive={false} path="/product/create-products" element={<CreateProducts />} />
                    <Route exact caseSensitive={false}  path={`/product/view-products`} element={<ViewProducts />} />
                </Routes>
            </BrowserRouter>

        </>
    )
}


export default MainRoutes;