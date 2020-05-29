import React, {useState} from 'react';
import { useQuery } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import { Button, Empty } from 'antd';
import { useParams } from 'react-router-dom';

import ProductCard from './component/ProductCard';
import ProductInfo from './component/ProductInfo';
import { useConfigCache, configId } from '../../utils/Constants';
import Loading from '../../utils/component/Loading';

const GET_PRODUCTS_QUERY = gql`
  query products($filter: JSONObject, $configId: String!) {
    products(filter: $filter, configId: $configId) {
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
  const routerParams = useParams();
  const [ productInfoModal, setProductInfoModal ] = useState(false);
  const [ selectedProduct, setSelectedProduct ] = useState(null);
  const { data, error, loading } = useQuery(GET_PRODUCTS_QUERY,{
    variables: {
      filter: {
        filter: {
          published: true
        }
      },
      configId: configId
    }
  });
  
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

  let categoryId = null;
  if (Object.keys(routerParams).length > 0) {
    categoryId = routerParams['_id'];
  }
  
  const getProducts = (dataInput) => {
    let result = [];

    dataInput.products.map((aProduct, index)=>{
      if (categoryId != null) {
        if (aProduct.category.length > 0) {
          let foundCategory = aProduct.category.find((aCategory)=>{
            let key = aCategory._id ? aCategory._id : null;
            return key == categoryId;
          })
          if (foundCategory) {
            result.push(
              <li key={index} className="products-card-item">
                <ProductCard product={aProduct} onClick={()=>{handleOnClickProduct(aProduct)}}/>
              </li>
            )
          }
        }
      }
      else {
        result.push(
          <li key={index} className="products-card-item">
            <ProductCard product={aProduct} onClick={()=>{handleOnClickProduct(aProduct)}}/>
          </li>
        )

      }
    })
    return result;
  }
  return (
    <div>
      {
        data.products.length > 0 && getProducts(data).length > 0 ?
          <ul className="products-container">
            {getProducts(data)}
          </ul>
          : <Empty/>
      }
      {
        productInfoModal ? (
          <ProductInfo
            modalVisible={productInfoModal}
            product={selectedProduct}
            closeModal={handleProductInfoModalClose}
          />
        ) : null
      }
    </div>
  )
}

export default Products;