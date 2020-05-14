import React, {useState, useEffect, useRef} from 'react';
import { Modal, Carousel, Select, Button, InputNumber, Input, Divider } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useLazyQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from 'graphql-tag';
import { useConfigCache } from '../../../utils/Constants';

const { Option } = Select;

const READ_PRODUCT_INVENTORY_QUERY = gql`
  query inventory($filter: JSONObject) {
    inventory(filter: $filter) {
      _id
      createdAt
      updatedAt
      price
      stock
      variants
      published
      productId
    }
  }
`;


const ProductInfo = (props) => {
  const { product, categories = [], modalVisible, refetch, closeModal } = props;
  const config = useConfigCache();
  let carouselRef = useRef(null);
  const [ inventoryData, setInventoryData ] = useState([]);

  const [ readInventory, readInventoryResult ] = useLazyQuery(READ_PRODUCT_INVENTORY_QUERY,{
    fetchPolicy: "cache-and-network",
    onCompleted: (result) => {
      if (result && result.inventory) {
        let flattenedInventory = [];
        result.inventory.map((anInventory,index)=>{
          const { variants, ...restInventory } = anInventory;
          let newInventory = {...restInventory, ...variants, key: restInventory._id};
          flattenedInventory.push(newInventory);
        })

        setInventoryData(result.inventory);
      }

    }
  })

  useEffect(() => {
    if (product && modalVisible) {
      readInventory({
        variables: {
          filter: {
            filter: {
              productId: product._id,
              published: true
            }
          }
        }
      });
    }
    
  }, [product, modalVisible]);

  const getProductImages = () => {

    const imageComponent = (src, key) => {
      return (
        <div key={key} className="aspect-ratio-1-1">
          <div className="aspect-ratio-wrapper" style={{display:'flex', alignItems:'center'}}>
            <img src={src} style={{width:'100%'}} />
          </div>
        </div>
      )
      // return (
      //   <div key={index} className="productInfo-main-carousel-item">
      //     <img src={src} style={{width:'100%'}} />
      //   </div>
      // )
    }
    let result = []
    if (product && product.images && product.images.length > 0) {
      product.images.map((anImage, index)=>{
        let src = config.imageSrc + anImage.name;
        if (anImage.fav) {
          result.unshift(imageComponent(src, index))
        }
        else {
          result.push(imageComponent(src, index))
        }
      })
    }
    if (result.length == 0) {
      result.push(imageComponent(config.defaultImage, 'noImage'))
    }
    return result;
  }

  const prevSlide = () => {
    carouselRef.prev();
  }
  const nextSlide = () => {
    carouselRef.next();
  }

  if (!product) return "No data";
  console.log('inventoryData',inventoryData)
  console.log('product',product)

  const getFooter = () => {
    const getVariantFieldsSelect = () => {
      let options = [];
      inventoryData.map((anInventory, index)=>{
        options.push(
          <Option key={index} value={anInventory._id}>{anInventory.price}</Option>
        )
      })
      return (
        <Select style={{ width: "100%",marginBottom:"10px" }}>
          {options}
        </Select>
      )
    }
    return (
      <React.Fragment>
        {getVariantFieldsSelect()}
        <div style={{display:"flex","flexWrap":"nowrap"}}>
          <Input
            min={1} 
            max={50} 
            style={{ marginRight:"10px" }} 
            addonBefore={"+"}
            addonAfter={"-"}
            type="number"
          />
          <Button type="primary" style={{width:"100%"}} disabled={false}>加入购物车</Button>
        </div>
      </React.Fragment>
    )
  }

  return (
    <Modal
      title={product ? product.name : ""}
      width={'99%'}
      visible={modalVisible}
      onCancel={closeModal}
      //destroyOnClose
      wrapClassName={'products-modalWrapper'}
      style={{overflow:"hidden"}}
      footer={inventoryData.length > 0 ? getFooter() : null}
    >
    <div className="productInfo-main">
      {/* <div className="productInfo-main-carousel-container"> */}
      <div className="aspect-ratio-1-1 productInfo-main-carousel-container">
      <div className="aspect-ratio-wrapper">
        <Carousel
          className="productInfo-main-carousel"
          ref={(ref)=>{carouselRef = ref}}
        >
          {getProductImages()}
        </Carousel>
        {
          product.images.length > 1 ? (
            <React.Fragment>
              <div className="productInfo-main-carousel-actions productInfo-main-carousel-prev" onClick={prevSlide}><LeftOutlined /></div>
              <div className="productInfo-main-carousel-actions productInfo-main-carousel-next" onClick={nextSlide}><RightOutlined /></div>
              <div className="productInfo-main-carousel-dots-container"></div>
            </React.Fragment>
          ) : null
        }
        </div>
        </div>
      {/* </div> */}
      <div>
        <div className="productInfo-main-description">
          <Divider orientation="left">产品详情</Divider>
          {/* <b>产品详情</b> */}
          <div>
            <pre>{product.description}</pre>
          </div>
        </div>
      </div>

    </div>
    </Modal>
  )
}

export default ProductInfo;