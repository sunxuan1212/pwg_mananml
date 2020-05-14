import React, {useState} from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import { Button, Modal, Empty } from 'antd';

import ProductCard from './component/ProductCard';
import ProductInfo from './component/ProductInfo';
import { useCustomQuery } from '../../utils/Constants';
import Loading from '../../utils/component/Loading';

const GET_PRODUCTS_QUERY = gql`
  query products($filter: JSONObject) {
    products(filter: $filter) {
      _id
      createdAt
      updatedAt
      name
      description
      category
      variants
      published
      images
    }
  }
`;

const Products = (props) => {
  const [ productInfoModal, setProductInfoModal ] = useState(false);
  const [ selectedProduct, setSelectedProduct ] = useState(null);

  const { data, error, loading } = useQuery(GET_PRODUCTS_QUERY,{
    variables: {
      filter: {
        filter: {
          published: true
        }
      }
    }
  });
  // const products = useCustomQuery(GET_PRODUCTS_QUERY);
  const handleProductInfoModalOpen = () => {
    setProductInfoModal(true);
  }
  const handleProductInfoModalClose = () => {
    setProductInfoModal(false);
  }

  const handleOnClickProduct = (product) => {
    handleProductInfoModalOpen();
    setSelectedProduct(product)
  }

  if (loading) return "loading";
  if (error) return `error: ${error}`;

  const getProducts = (dataInput) => {
    let result = [];
    dataInput.products.map((aProduct, index)=>{
      result.push(
        <li key={index} className="products-card-item" 
          onClick={()=>{handleOnClickProduct(aProduct)}}
        >
          <ProductCard product={aProduct}/>
        </li>
      )
    })
    return result;
  }
  return (
    <div>
      products
      <ul className="products-container">
        {
          loading ? <Loading/> 
          : (error ? "Error" 
            : (data.products.length > 0 ? getProducts(data) : <li style={{width:'100%'}}><Empty/></li> ))
        }
      </ul>
      <ProductInfo
        modalVisible={productInfoModal}
        product={selectedProduct}
        closeModal={handleProductInfoModalClose}
      />
    </div>
  )
}

export default Products;