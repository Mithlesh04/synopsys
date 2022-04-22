import React, { useRef } from "react";

function ProductImage({ image, name, onChange }){
    const inputImg = useRef(null);
    return(
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={ image }
                    alt="product"
                    style={{ width: 150, height: 150, borderRadius: 10 }}
                    onClick={_ => inputImg?.current?.click()}
                />
            </div>
            <div style={{ marginLeft: 10 }}>
                {
                    name
                }

            </div>
            <input type='file' ref={inputImg} name="image" accept='image/*' style={{ display: 'none' }} onChange={onChange} />
        </>
    )
}

export default ProductImage;