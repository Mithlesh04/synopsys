import axios from 'axios';
import endpoint from './endpoint'

export function createProductApi(product) {
    return axios.post(endpoint+'/products/create', product);
}

export function getCategoriesApi() {
    return axios.get(endpoint+'/products/categories');
}

export function getProductApi(params) {
    return axios.get(endpoint+'/products',{params});
}

export function updateProductDetailsApi(product) {
    return axios.put(endpoint+'/products/update', product);
}

export function deleteProductApi(product) {
    return axios.post(endpoint+'/products/delete', product);
}