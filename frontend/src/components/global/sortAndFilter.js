import { useState, useCallback } from 'react';


/**
 data examples
----------------------------------
const tableData = [
  {id:1,name:'product 1',price: { car: { newVal: { oldVal: 30000000000 }} } },
  {id:2,name:'product 2',price: { car: { newVal: { oldVal: 1 }} }},
  {id:7,name:'product 7',price: { car: { newVal: { oldVal: '700' }} }},
  {id:3,name:'product 3',price: { car: { newVal: { oldVal: 500000000000 }} }},
  {id:6,name:'product 6',price: { car: { newVal: { oldVal: 6000000000 }} }},
  {id:5,name:'product 5',price: { car: { newVal: { oldVal: 500 }} }},
  {id:4,name:'product 4',price: { car: { newVal: { oldVal: 400 }} }},
]
or
const tableData = [
    2, 3, 4, 5, 6, 7, 1
]

 */


function useSortAndFilter(tableData = []) {


    // p = price || price.car
    const getPropertyValue = (data, p) => {
        if (p.includes('.')) {
            let temp = p.split('.'), lstObj = null;
            while (temp.length > 0) {
                lstObj = temp.shift();
                data = data[lstObj];
            }
            return data;
        } else {
            return data[p]
        }
    }

    // console.log('v = ',getPropertyValue( {id:4,name:'product 4',price: 400 },'price'))
    /**
     * default sort state asc
     * @sortBy (string) | ($$array) Note: $$array is for array sorting only and for object sorting use sortBy(string)
     * @sortOrder ('desc' | 1) or ('asc' | 0)
     * @cb (function) callback function
     */
    
    const sort = useCallback((sortBy, sortOrder, cb) => {
        let data = [...tableData], 
            isDesc = String(sortOrder).toLowerCase() === 'desc' || sortOrder === 1, 
            isCb = typeof cb === 'function' ? cb : false,
            isArray = sortBy === '$$array' ? true : false;


        return data.sort(function (a, b) {
            let av = isArray ? a : getPropertyValue(a, sortBy),
                bv = isArray ? b : getPropertyValue(b, sortBy),
                sn = !isNaN(av),
                bn = !isNaN(bv),
                rval = 0;

            if (isDesc) {
                if (sn && bn) {
                    rval = bv - av
                } else {
                    rval = String(bv).localeCompare(String(av))
                }
            } else {
                if (sn && bn) {
                    rval = av - bv
                } else { // when value is like an object or array 
                    rval = String(av).localeCompare(String(bv))
                }
            }

            return isCb ? isCb(a, b, { val: rval, val1: av, val2: bv }) : rval;
        })

    }, [tableData])

    const search = useCallback((searchBy, searchValue) => {
        let isArray = searchBy === '$$array' ? true : false;

        return tableData.filter(function (item) {
            let v = isArray ? item : getPropertyValue(item, searchBy);
            return String(v).toLowerCase().includes(String(searchValue).toLowerCase())
        }).sort(function (a, b) {
            let av = isArray ? a : getPropertyValue(a, searchBy),
                bv = isArray ? b : getPropertyValue(b, searchBy) 
            return String(av).localeCompare(String(bv))
        })
    }, [tableData])

    return { sort, search }
}


export default useSortAndFilter;