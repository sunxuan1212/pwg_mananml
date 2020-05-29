import React from 'react';
import { Tag, Tooltip } from 'antd';
import { useConfigCache } from '../../../utils/Constants';

const ProductCard = (props) => {
  const { product, onClick } = props;
  const config = useConfigCache();

  const getProductImages = () => {
    let srcResult = config.defaultImage;
    if (product.images && product.images.length > 0) {
      let foundFavImage = product.images.find((anImage)=>anImage.fav);
      if (foundFavImage) {
        srcResult = config.imageSrc + foundFavImage.name;
      }
    }
    return {
      backgroundImage: `url(${srcResult})`
    }
  }

  const onCardClicked = () => {
    onClick()
  }


  return (
    <div className="productCard-container" onClick={onCardClicked}>
      <div className="productCard-media" style={getProductImages()}></div>
      <div className="productCard-info">
        
        <div className="productCard-status">
          <Tooltip title={product.name}>
            <div className="productCard-title">{product.name}</div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;