
/**
 * @validateRequestParams
 * @param {disc} reqParams this is the request parameters
 * @param {disc} model this is the model that we want to validate
 * @param {boolean} stopOnFirstError @default true this is a boolean that if true, will stop on first error
 * @param {boolean} shouldAcceptOutOfModelParams @default false this is a boolean that if true, will accept out of model parameters
 *   ----------------------------------------------------------------
 *  | shouldAcceptOutOfModelParams (recommended = false)             |
 *  | if true then it's possible to give an error or hack the server |
 *   ----------------------------------------------------------------
 */
function validateRequestParams(reqParams = {}, model = {}, stopOnFirstError = true, shouldAcceptOutOfModelParams = false) {
    var res = {
        isError: false,
        errorList: [],
        errorMsg: '',
        data: {},//new data will be according to the model columns name, if column not found and shouldAcceptOutOfModelParams is true, then it will be added to data with reqParams key
    }

    if ('object' !== typeof model || 'object' !== typeof reqParams) {
        res.isError = true;
        res.errorMsg = 'validateRequestParams: some parameters are not objects';
        return res;
    }

    var modelList = Object.keys(model), mdlL = modelList.length,
        rqPrmList = Object.keys(reqParams), rqPrmL = rqPrmList.length;

    function error(msg) {
        res.errorList.push(msg);
        res.isError = true;
        res.errorMsg = msg;
    }


    // check if all the request parameters are in the model
    if (mdlL !== rqPrmL && shouldAcceptOutOfModelParams) {
        for (let k = 0; k < rqPrmL; k++) {
            let ck = rqPrmList[k]
            if (modelList.includes(ck)) continue;
            modelList.push(ck);
            model[ck] = { name: ck, type: typeof reqParams[ck], required: false };
        }
        mdlL = modelList.length;
    }

    const methods = {
        required(mk, val, req) {
            if (!req) return false;
            let c = val !== undefined && val !== null && val !== '' && val !== 0
            if (!c) {
                error(`${mk} is required`);
            }
            return c;
        },
        string(mk, val) {
            let c = 'string' === typeof val
            if (!c) {
                error(`${mk} must be a string`);
            }
            return c;
        },
        number(mk, val) {
            let c = 'number' === typeof val
            if (!c) {
                error(`${mk} must be a number`);
            }
            return c;
        },
        file(mk, val) {
            let c = 'object' === typeof val

            if (c) {
                if (!val.mimetype || !val.size) {
                    c = false;
                }
            }

            if (!c) {
                error(`${mk} must be a file`)
            }
            return c;
        },
        boolean(mk, val) {
            let c = 'boolean' === typeof val
            if (!c) {
                error(`${mk} must be a boolean`)
            }
            return c;
        },
        max(mk, val, max) {
            let c = 'string' === typeof val && val.length <= max
            if (!c) {
                if( 'number' === typeof val ){
                    c = val <= min
                }
                if(!c){
                    error(`${mk} must be less than or equal to ${max}`)
                }
            }
            return c;
        },
        min(mk, val, min) {
            let c = 'string' === typeof val && val.length >= min
            if (!c) {
                if( 'number' === typeof val ){
                    c = val >= min
                }
                if( !c ){
                    error(`${mk} must be max than or equal to ${min}`)
                }
            }
            return c
        },
        accept(mk, val, accept) {
            let c = accept.includes((val || {}).mimetype.split('/')[1])
            if (!c) {
                error(`${mk} must be one of the following types: ${accept.join(', ')}`)
            }
            return c;
        },
        maxSize(mk, val, maxSize) {
            let c = val.size <= maxSize
            if (!c) {
                error(`${mk} is too big`)
            }
            return c;
        },
        convert(mk, val, convert) {
            let c;
            if ('number' === convert) {
                c = Number(val);
            } else if ('string' === convert) {
                c = String(val);
            } else if ('boolean' === convert) {
                c = Boolean(val);
            }
            return c;
        }
    }

    for (let i = 0; i < mdlL; ++i) {
        let mk = modelList[i]
        if (rqPrmList.includes(mk)) {
            let rqVal = reqParams[mk]
            let mdlVal = model[mk]
            let isValidThis = false;

            for (let k in mdlVal) {
                let cK = k
                if (k === 'type') cK = mdlVal.type
                if (methods[cK]) {
                    isValidThis = methods[cK](mk, rqVal, mdlVal[cK])
                    if (!isValidThis && cK === 'required') {
                        isValidThis = true;
                    } else if (cK === 'convert') {
                        rqVal = isValidThis
                    }
                    if (!isValidThis && stopOnFirstError) {
                        break;
                    }
                } else {
                    isValidThis = true;
                }
            }

            if (isValidThis) { res.data[mdlVal.name || mk] = rqVal }
            if (res.isError && stopOnFirstError) break;

        } else {
            if (!shouldAcceptOutOfModelParams) {
                if (model[mk]?.required) error(`${mk} is required`);
            } else res.data[mk] = reqParams[mk];
            if (res.isError && stopOnFirstError) break;
        }

    }

    return res;

}

module.exports = validateRequestParams;