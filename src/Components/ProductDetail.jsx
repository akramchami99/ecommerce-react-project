import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useContext(AuthContext);

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then((res) => res.json())
            .then((data) => setProduct(data));
    }, [id]);

    if (!product) return <div>Loading...</div>;

    return (
        <div className='product-detail-main'>
            <div className='product-presentation'>
                <img src={product.image} alt={product.title} />
                <div className='product-descriptions'>
                    <h1>{product.title}</h1>
                    <p>{product.description}</p>
                    <p>${product.price}</p>
                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;