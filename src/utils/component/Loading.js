import React, {useState} from 'react';
import {
  LoadingOutlined
} from '@ant-design/icons';

const Loading = (props) => {
  const [showLoading, setShowLoading] = useState(true);

  let loadingStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backgroundColor: "rgba(255,255,255,0.4)",
    pointerEvents: 'none'
  }

  if (showLoading) {
    return (
      <div className="loading" style={loadingStyle}>
        <LoadingOutlined/>
      </div>
    )
  }
  return null;
}

export default Loading;