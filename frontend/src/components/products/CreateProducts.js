import React, { useState,useEffect } from "react";
import { Button, Form, Container, FormGroup, FormControl } from "react-bootstrap"
import { createProductApi, getCategoriesApi } from "../../api/productsApi";
import { toast } from 'react-toastify';
import ProductImage from './ProductImage'

const styles = {
    forms: {
        paddingTop: 20,
    }
}

const defaultProductImage = 'https://www.clickbank.com/wp-content/uploads/2021/11/Sell-Your-Product.png'
const inputes = {
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
}
function CreateProducts(){
    const [product, setProduct] = useState(inputes);
    const [categories, setCategories] = useState([]);
    const [errorMsg,setErrorMsg] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let fm = document.getElementById('product-form')
        const formData = new FormData(fm);
        if(!product.name || !product.price || !product.category){
            setErrorMsg('Please fill all the required fields');
            return;
        }
        setErrorMsg('');

        const res = await createProductApi(formData);
        if(res){
            if(res.data.isValid){
                fm.reset();
                toast.success(res.data.message);
                setProduct(inputes)
            }else{
                setErrorMsg(res.data.message);
            }
        }else{
            setErrorMsg('Error creating product');
        }
    }

    const handleInputChange = (e) => {
        setProduct(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    useEffect(()=>{
        getCategoriesApi().then(res => {
            if(res){
                setCategories(res.data.data || []);
            }
        }).catch(err => {
            console.log(err);
        })
    },[])

    return(
        <Container fluid style={{maxWidth: 500,margin: "10px auto"}}>
            <h4>Upload Product</h4>
            <Form onSubmit={handleFormSubmit} id="product-form">
                <FormGroup style={{ ...styles.forms, textAlign: 'center' }}>
                    <ProductImage 
                        onChange={e => {
                            console.log('e = ',e.target.files[0])
                            setProduct(prev => ({ ...prev, image: e.target.files[0] }))
                        }}
                        image={product.image ? URL.createObjectURL(product.image) : defaultProductImage} 
                        name={product?.image?.name || 'Product Image'} 
                    />
                </FormGroup>
                <FormGroup style={{ ...styles.forms, textAlign: 'center', color: 'red' }}>
                    { errorMsg }
                </FormGroup>
                <FormGroup style={styles.forms}>
                    <FormControl onChange={handleInputChange} name="name" type="text" placeholder="Product Name" required />                    
                </FormGroup>
                <FormGroup style={styles.forms}>
                    <FormControl type="number" onChange={handleInputChange} name="price" placeholder="Product Price" required />
                </FormGroup>
                <FormGroup style={styles.forms}>
                    <Form.Select required onChange={handleInputChange} name="category">
                        <option value={0}>Select Category</option>
                        {
                            categories.map(({ id, name}) => <option key={id} value={id}>{name}</option>)
                        }
                    </Form.Select>
                </FormGroup>
                <FormGroup style={styles.forms} onChange={handleInputChange}>
                    <Form.Control
                        as="textarea"
                        style={{ height: 100, resize: 'none' }}
                        placeholder="Product Description"
                        name="description"
                    />
                </FormGroup>
                <FormGroup style={{...styles.forms,textAlign:'center'}}>
                    <Button variant="primary" type="submit" size="lg">
                        Submit
                    </Button>
                </FormGroup> 
            </Form>
        </Container>
    )
}

export default CreateProducts;