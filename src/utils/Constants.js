
import React from 'react';
import { useState, useEffect } from 'react';
import gql from "graphql-tag";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";

import DefaultClientAPI from '../index';
import Loading from './component/Loading';

export const configId = "mananml";
export const defaultImage_system = require("./noImageFound.png");

export const MIDDLETIER_URL = "http://localhost:3000/graphql";
// export const MIDDLETIER_URL = "http://13.124.162.243/graphql";

const GET_USER_CONFIG_QUERY = gql`
  query userConfig($configId: String!) {
    userConfig(configId: $configId) {
        success
        message
        data
    }
  }
`

const GET_CONFIG_CACHE_QUERY = gql`
  query config {
    config @client {
      _id
      configId
      defaultImage_system
      defaultImage
      imageSrc
      paymentQRImage
      server
      profile
    }
  }
`

const SET_CONFIG_CACHE_QUERY = gql`
  query config {
    config {
      _id
      configId
      defaultImage_system
      defaultImage
      imageSrc
      paymentQRImage
      server
      profile
    }
  }
`

const handleConfigOuput = (config = null) => {
  let result = null;
  if (config) {
    result = {...config}
    let newDefaultImage = defaultImage_system;
    if (result.defaultImage && result.defaultImage != "") {
      newDefaultImage = result.imageSrc + result.defaultImage;
    }
    result['defaultImage'] = newDefaultImage;
  }
  return result;
}

export const setConfigCache = (data) => {
  DefaultClientAPI.client.writeQuery({
    query: SET_CONFIG_CACHE_QUERY,
    data: {
      config: handleConfigOuput(data)
    }
  });
}

export const useConfigCache = () => {
  const { data, error, loading } = useQuery(GET_CONFIG_CACHE_QUERY,{
    fetchPolicy: 'cache-only'
  });

  let result = null;
  if (loading) {
    // console.log('loading');
  }
  if (error) {
    console.log('error useConfigCache',error);
  }
  if (data && data.config) {
    result = data.config;
  }
  return result;
}

export const useConfigQuery = (input) => {
  // const [ getConfig, { data, error, loading } ] = useLazyQuery(GET_USER_CONFIG_QUERY,{
  const { data, error, loading } = useQuery(GET_USER_CONFIG_QUERY,{
    fetchPolicy: 'cache-and-network',
    variables: {
      configId: input ? input : configId
    },
    onCompleted: (result) => {
      if (result && result.userConfig && result.userConfig.success) {
        let updateConfig = result.userConfig.data;
        setConfigCache(updateConfig)
      }
    }
  });
  let result = null;
  if (loading) {
    // console.log('loading');
  }
  if (error) {
    console.log('useConfigQuery',error);
  }
  if (data && data.userConfig) {
    result = handleConfigOuput(data.userConfig);
  }
  return result;
}

export const useCustomQuery = (query, options={}) => {
  const { data, error, loading } = useQuery(query,options);
  if (loading) return <Loading/>;
  if (error) return "error"
  return data;
}

export const useProductsState = (query, options={}) => {
  const queryResult = useQuery(query,options);
  return queryResult;
}

// custom hook starts with 'use'
// const useCustomHook = () => {
//   const [state, setState] = useState(null);
//   useEffect(() => {
//     const handleScroll = () => setScrollPosition(window.scrollY);
//     document.addEventListener('scroll', handleScroll);
//     return () => 
//       document.removeEventListener('scroll', handleScroll);
//   }, []);
// }