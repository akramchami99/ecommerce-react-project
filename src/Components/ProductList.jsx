import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { CartContext } from './CartContext';

const ProductList = () => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      });

    fetch('https://fakestoreapi.com/products/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }
    if (sortOption === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'best-reviewed') {
      filtered.sort((a, b) => b.rating.rate - a.rating.rate);
    }
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategories, sortOption, products]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter(c => c !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <div className='product-list-main'>
      <h1>Products</h1>
      <div className='product-list-content'>
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <h3>Category:</h3>
          <div className="category-filters">
            {categories.map((category, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={`category-${index}`}
                  value={category}
                  onChange={() => handleCategoryChange(category)}
                  checked={selectedCategories.includes(category)}
                />
                <label htmlFor={`category-${index}`}>{category}</label>
              </div>
            ))}
          </div>
          <h3>Sort By:</h3>
          <div className="sort-filters">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="best-reviewed">Best Reviewed</option>
            </select>
          </div>
        </div>
        <div className="product-list">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-item">
              <Link to={`/product/${product.id}`}>
                <h2>{product.title}</h2>
                <img src={product.image} alt={product.title} />
              </Link>
              <p>${product.price}</p>
              <p>Rating: {product.rating.rate} ({product.rating.count} reviews)</p>
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
