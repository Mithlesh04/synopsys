import React, { useState } from "react";
import { Row,Col, Form, Container, FormGroup, FormControl } from "react-bootstrap"

const searchColumns = ['id','category','name', 'price', 'description'];

function ProductSearchBar({ handleGetProducts }) {
    const [searchBy, setSearchBy] = useState('id');
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
        handleGetProducts({ search : { [searchBy]: e.target.value }});
    }

    return(
            <Container fluid  className="p-3">
              <Row>
                  <Col xs={12} sm={8}>
                        <h4 style={{marginBottom:20}}>Product List</h4>
                  </Col>
                <Col>
                    <FormGroup >
                        <Form.Select value={searchBy} name="category" className="text-capitalize"  onChange={_=>setSearchBy(_.target.value)} required>
                            {
                                searchColumns.map((name) => <option key={name} value={name}>{name}</option>)
                            }
                        </Form.Select>
                    </FormGroup>
                </Col>

                <Col>            
                    <FormGroup>
                        <FormControl value={searchValue} onChange={handleSearch} name="name" type="text" placeholder={"Search by "+ searchBy} required />                    
                    </FormGroup>  
                </Col>
              </Row>
            </Container>

    );
}

export default ProductSearchBar;