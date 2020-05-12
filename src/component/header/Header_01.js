import React from 'react';
import { Button } from 'antd';
import { useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { useConfigCache } from '../../utils/Constants';

const Header_01 = (props) => {
  let config = useConfigCache();
  
  return (
    <div>
      Header_01
      Welcome, {config ? config.configId : ""}
    </div>
  )
}

export default Header_01;