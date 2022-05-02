const conn = require('../models/db_connections/mysql_db_conn');
const validateRequestParams = require('../globals/validateRequestParams');
const { createProductModel } = require('../models/products/ProductsModels');
const sendResponse = require('../globals/sendResponse');
const fs = require('fs');

function createProduct(req, res) {
    const validate = validateRequestParams({
        ...req.body || {},
        ...(req.files[0]) && { image: req.files[0] },
    }, createProductModel);

    if (validate.isError) {
        return sendResponse(res, 200, {
            status: 400,
            isValid: false,
            message: validate.errorMsg
        });
    }

    function dbQuery() {
        conn.query(`INSERT INTO products SET ?`,validate.data, (err, result) => {
            if (err) {
                sendResponse(res, 200, {
                    status: 200,
                    isValid: false,
                    message: 'Error creating product'
                })
            } else {
                sendResponse(res, 200, {
                    status: 200,
                    isValid: true,
                    message: 'Product created successfully'
                })
            }
        })
    }

    if (validate.data.image) {
        const file = validate.data.image;
        const fileExt = file.originalname.split('.').pop();
        const fileDestination = `products/${file.filename}.${fileExt}`;
        fs.rename(file.path, 'public/' + fileDestination, (err) => {
            if (err) {
                return sendResponse(res, 200, {
                    status: 400,
                    isValid: false,
                    message: 'Error uploading file'
                });
            } else {
                validate.data.image = fileDestination;
                dbQuery();
            }
        });
    } else {
        dbQuery()
    }


}



function getProductCategories(req, res) {
    conn.query(`SELECT id,name FROM categories`, (err, result) => {
        if (err) {
            sendResponse(res, 200, {
                status: 200,
                isValid: false,
                message: 'Error fetching product categories'
            })
        } else {
            sendResponse(res, 200, {
                status: 200,
                isValid: true,
                data: result
            })
        }
    })
}


function getProduct(req, res) {
    const { search={}, sort } = req.query || {};
    var query = `SELECT id,name,price,description,image,category_id,is_active,created_at,updated_at FROM products WHERE is_active=1 AND is_deleted=0`
    
    if(search) {
        try{
            // search = { key : value }
            let s = Object.entries(JSON.parse(search))[0]     
            if(s[0] === 'category') {
                query += `
                         AND category_id IN (
                            SELECT id FROM categories WHERE name LIKE '%${s[1]}%'
                        )
                    `
            } else {   
                query += ` AND ${s[0]} LIKE '%${s[1]}%'`
            }
        }catch(e){}
    }

    if(sort) {
        try{
            // sort = {
            //     // key : asc, desc
            //     key: 'asc'
            // }
            let s = Object.entries(JSON.parse(sort))[0]
            query += ` ORDER BY ${s[0]} ${s[1]}`
        }catch(e){}
    }

    conn.query(query, (err, result) => {      
        if (err) {
            sendResponse(res, 200, {
                status: 200,
                isValid: false,
                message: 'Error fetching products'
            })
        } else {
            sendResponse(res, 200, {
                status: 200,
                isValid: true,
                data: result||[]
            })
        }
    })

}

// getProduct({},{
//     body: {
//         search: '{"category_id":"FOOD"}',
//     }
// })

function updateProductDetails(req, res) {
    const body = req.body;

    if (!body.id) {
        return sendResponse(res, 200, {
            status: 400,
            isValid: false,
            message: 'Product id is required'
        })
    }

    const validObjModel = {}
    for (let k in createProductModel) {
        if (body[k]) {
            validObjModel[k] = createProductModel[k]
        }
    }

    const validate = validateRequestParams(body, validObjModel);

    if (validate.isError) {
        return sendResponse(res, 200, {
            status: 400,
            isValid: false,
            message: validate.errorMsg
        });
    }
    

    conn.query(`UPDATE products SET ? WHERE id=${body.id}`, validate.data, (err, result) => {
        if (err) {
            sendResponse(res, 200, {
                status: 200,
                isValid: false,
                message: 'Error updating product'
            })
        } else {

            // send notification to all users
            let io = req.app.get("socketIo")//.emit('pUpdate', validate.data);

            // emit data not to the current user
            
            
            sendResponse(res, 200, {
                status: 200,
                isValid: true,
                message: 'Product updated successfully'
            })

        }
    })
}


function deleteProduct(req, res) {
    const body = req.body;

    if (!body.id) {
        return sendResponse(res, 200, {
            status: 400,
            isValid: false,
            message: 'Product id is required'
        })
    }

    conn.query(`UPDATE products SET is_deleted=1, is_active=0 WHERE id=${body.id}`, (err) => {
        if (err) {
            sendResponse(res, 200, {
                status: 200,
                isValid: false,
                message: 'Error deleting product'
            })
        } else {
            sendResponse(res, 200, {
                status: 200,
                isValid: true,
                message: 'Product deleted successfully'
            })
        }
    })
}

module.exports = {
    createProduct,
    getProductCategories,
    getProduct,
    updateProductDetails,
    deleteProduct
}