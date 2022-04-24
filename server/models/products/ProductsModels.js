
module.exports = {
    createProductModel: {
        // request_keys : columns details
        name: { name: 'name', type: 'string', max: 255, required: true },
        price: { name: 'price', convert: 'number', type: 'number', min: 100, required: true },
        category: { name: 'category_id', convert: 'number', type: 'number', required: true },
        description: { name: 'description', type: 'string', min: 1, max: 1000, required: false },
        image: { name: 'image', type: 'file', required: false, accept: ['jpg','png','jpeg'], maxSize: 1024 * 1024 },
    }
}