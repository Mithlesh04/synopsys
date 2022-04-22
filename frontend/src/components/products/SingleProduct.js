import React, { useState, memo } from "react"
import { Form, FormGroup, FormControl } from "react-bootstrap"
import ProductImage from './ProductImage'
import moment from 'moment'
import endpoint from '../../api/endpoint'

const elements = {
    Textarea({ name, props, ...rest }) {
        const { onChange, defaultValue, value, ...sRest } = rest;
        const [input, setInput] = useState(value || defaultValue || props[name] || '')
        const handleOnChange = (e) => {
            setInput(e.target.value)
            onChange && onChange(e)
        }
        return (
            <FormGroup>
                <Form.Control
                    as="textarea"
                    style={{ height: 60, resize: 'none' }}
                    value={input}
                    onChange={handleOnChange}
                    name={name}
                    {...sRest}
                />
            </FormGroup>
        )
    },
    Input({ name, props, ...rest }) {
        const { onChange, defaultValue, value, ...sRest } = rest;
        const [input, setInput] = useState(value || defaultValue || props[name] || '')
        const handleOnChange = (e) => {
            setInput(e.target.value)
            onChange && onChange(e)
        }
        return (
            <FormGroup>
                <FormControl
                    type="text"
                    value={input}
                    onChange={handleOnChange}
                    name={name}
                    {...sRest}
                />
            </FormGroup>
        )
    },
    Img({ name, props, ...rest }) {
        return <ProductImage image={props[name]} {...rest} />
    },
    Select({ name, props, selectedId, options = [], ...rest }) {
        const { onChange, defaultValue, value, ...sRest } = rest;
        const [selected, setSelected] = useState(selectedId || value || defaultValue)
        const handleOnChange = (e) => {
            setSelected(e.target.value)
            onChange && onChange(e)
        }
        return (
            <FormGroup>
                <Form.Select required {...sRest} name={name} onChange={handleOnChange} value={selected}>
                    {
                        options.map(({ id, name }) => <option key={id} value={id}>{name}</option>)
                    }
                </Form.Select>
            </FormGroup>
        )
    }
}

function SingleProduct(props) {
    const {
        categories = [], index, id, image, category_id, created_at, updated_at,
        onUpdate
    } = props

    const [isEdit, setIsEdit] = useState(false)
    const updateKeys = {}

    const EditableComponent = ({ name, defaultValue, tag, ...rest }) => {
        const TagComponent = isEdit ? elements[tag] : null
        return (
            tag === 'Img' ?
                props[name] ?
                    <img src={endpoint + '/' + props[name]} alt="product" style={{ width: 80, height: 80, borderRadius: 10 }} />
                    : 'No image available'

            :
                isEdit ?
                    <TagComponent name={name} defaultValue={defaultValue} {...rest} props={props} />
                    :
                    defaultValue || props[name]
        )
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target
        if (name === 'image') {
            updateKeys[name] = URL.createObjectURL(e.target.files[0])
        } else {
            updateKeys[name] = value
        }
    }

    return (
        <tr>
            <td style={{ verticalAlign: "middle" }}>{index+1}.</td>
            <td style={{ verticalAlign: "middle" }}>{id}</td>
            <td style={{ verticalAlign: "middle" }}>
                <EditableComponent
                    image={updateKeys.image ? URL.createObjectURL(updateKeys.image) : image}
                    tag="Img"
                    name="image"
                    onChange={handleOnChange}
                />
            </td>
            <td style={{ verticalAlign: "middle" }}><EditableComponent tag="Input" placeholder="Product Name" type="text" name="name" onChange={handleOnChange} /></td>
            <td style={{ verticalAlign: "middle" }}><EditableComponent tag="Input" placeholder="Product Price" type="number" name="price" onChange={handleOnChange} style={{ maxWidth: 100 }} /></td>
            <td style={{ verticalAlign: "middle" }}><EditableComponent tag="Select" selectedId={category_id} options={categories} defaultValue={categories.find(e => e.id === category_id).name} onChange={handleOnChange} name="category" /></td>
            <td style={{ verticalAlign: "middle" }}><EditableComponent tag="Textarea" placeholder="Product Description" onChange={handleOnChange} value={props.description} name="description" /></td>
            <td style={{ verticalAlign: "middle" }}>{moment(created_at).format('YYYY-MMMM-DD')}</td>
            <td style={{ verticalAlign: "middle" }}>{moment(updated_at).format('YYYY-MMMM-DD')}</td>
            <td onClick={_ => {
                if (isEdit) {
                    let nuk = {}, insert = false
                    for(let k in updateKeys){
                        if(updateKeys[k] !== props[k]){
                            nuk[k] = updateKeys[k]
                            insert = true
                        }
                    }
                    insert && onUpdate(index, id, 'update', nuk)
                    setIsEdit(false)
                } else {
                    setIsEdit(true)
                }
            }} style={{ cursor: 'pointer', verticalAlign: "middle" }}>
                {
                    isEdit ?
                        <i style={{ fontSize: '1.3rem', color: 'green' }} className="bi-file-earmark-check"></i>
                        :
                        <i style={{ fontSize: '1.2rem', color: 'blue' }} className="bi-pencil"></i>
                }
            </td>
            <td onClick={_ => {
                if (isEdit) {
                    setIsEdit(p => !p)
                } else {
                    onUpdate(index, id, 'delete')
                }
            }} style={{ cursor: 'pointer', verticalAlign: "middle" }}>
                {
                    isEdit ?
                        <i style={{ fontSize: '1.3rem', color: 'skyblue' }} className="bi-x-circle"></i>
                        :
                        <i style={{ fontSize: '1.2rem', color: 'red' }} className="bi-trash"></i>
                }
            </td>
        </tr>
    )
}

export default memo(SingleProduct);