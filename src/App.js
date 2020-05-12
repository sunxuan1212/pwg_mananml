import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import * as Components from './component/index'; 
import { useConfigQuery } from './utils/Constants';
import logo from './logo.svg';
import './App.css';

const App = () => {
  const configCache = useConfigQuery();

  const Main1 = () => {
    return (
      <div>
        Main1
      </div>
    )
  }
  const Main2 = () => {
    return (
      <div>
        Main2
      </div>
    )
  }

  // if (loading) return 'Loading...';
  // if (error) return `Error! ${error.message}`;
  if (!configCache) return "Error"

  let Header = Components['Header_01'];

  return (
    <div className="App">
      <Header/>
      <BrowserRouter>
        <Switch>
          <Route component={Main1} path={'/main1'}/>
          <Route component={Main2} path={'/main2'}/> 
        </Switch>
     </BrowserRouter>
    </div>
  );
}

export default App;
