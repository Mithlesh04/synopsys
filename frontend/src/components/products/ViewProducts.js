import React, { useState, useEffect, memo } from "react"
import { Container, Table } from "react-bootstrap"
import { getProductApi, getCategoriesApi, updateProductDetailsApi, deleteProductApi } from "../../api/productsApi"
import { toast } from 'react-toastify';
import SingleProduct from './SingleProduct';
import ProductSearchBar from './ProductSearchBar';

function ViewProducts() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([]);
    const [sortKey, setSortKey] = useState({});

    const handleGetProducts = async (params={}) => {
        const result = await getProductApi(params)
        if(result){
            setProducts(result.data.data||[])
        }
    }

    const onUpdate = async (index,id,type,keys={})=>{
        // type = update,delete
        if(type === 'delete'){
            const result = await deleteProductApi({ id })
            if(result && result.data.isValid){
                toast.success(result.data.message)
                setProducts(prev=>{
                    return prev.filter((p,i)=> i!==index && p.id !== id)
                })
            }else{
                toast.error(result.data.message)
            }
        }else if( type === 'update' ){
            const required = ['name','price','category']
            let isValid = true
            for(let k of required){
                if(keys.hasOwnProperty(k)){
                    if(!keys[k]){
                        isValid = false
                        toast.error(`${k} is required`)
                        break;
                    }
                }
            }
            if(isValid){
                const res = await updateProductDetailsApi({id,...keys})
                if(res){
                    if(res.data.isValid){
                        toast.success(res.data.message)
                        setProducts(prev=>
                            prev.map((p,i)=>{
                                if(i===index){
                                    const { category, ...rest } = keys
                                    return {
                                        ...p, ...rest, 
                                        ...category && {category_id: category}
                                    }
                                }
                                return p
                            })
                        )
                    }else{
                        toast.error(res.data.message)
                    }
                }
            }
        }
    }

    const sortBy = (e)=>{
        const { name } = e.target.dataset
        console.log('d = ',name)
        let s = {}
        if(sortKey[name]){ //asc
            if(sortKey[name] === 'DESC'){
                s[name] = 'ASC'
            }else{
                s[name]= 'DESC'
            }
        }else{
            if(sortKey[name] === 'DESC'){
                s[name] = 'ASC'
            }else{
                s[name]= 'DESC'
            }
        }
        handleGetProducts({sort:s})
        setSortKey(s)
    }

    useEffect(() => {
        
        handleGetProducts()
        getCategoriesApi().then(res => {
            if(res){
                setCategories(res.data.data || []);
            }
        }).catch(err => {
            console.log(err);
        })
    }, [])

    const [sortedKey] = Object.entries(sortKey)[0] || []
    return (
        <Container fluid style={{margin: "10px auto"}}>
            <ProductSearchBar handleGetProducts={handleGetProducts} />
            
            <Table hover style={{width:'100%'}}>
                <thead>
                    <tr>
                        <th>S.No.</th>
                        <th className={`${ sortedKey==='id' && "text-info"} `} style={{cursor:'pointer'}} data-name="id" onClick={sortBy}>ID</th>
                        <th>Image</th>
                        <th className={`${ sortedKey==='name' && "text-info"} `} style={{cursor:'pointer'}} data-name="name" onClick={sortBy}>Name</th>
                        <th className={`${ sortedKey==='price' && "text-info"} `} style={{cursor:'pointer'}} data-name="price" onClick={sortBy}>Price</th>
                        <th className={`${ sortedKey==='category_id' && "text-info"} `} style={{cursor:'pointer'}} data-name="category_id" onClick={sortBy}>Category</th>
                        <th className={`${ sortedKey==='description' && "text-info"} `} style={{cursor:'pointer'}} data-name="description" onClick={sortBy}>Description</th>
                        <th className={`${ sortedKey==='created_at' && "text-info"} `} style={{cursor:'pointer'}} data-name="created_at" onClick={sortBy}>Created at</th>
                        <th className={`${ sortedKey==='updated_at' && "text-info"} `} style={{cursor:'pointer'}} data-name="updated_at" onClick={sortBy}>Updated at</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product, index) =><SingleProduct categories={categories} onUpdate={onUpdate} index={index} key={index} {...product} />)
                    }
                </tbody>
            </Table>
                <div className="text-center mt-4">
                    {products.length === 0 && <h4>No Products found</h4>}
                </div>
        </Container>
    )
}

export default memo(ViewProducts);