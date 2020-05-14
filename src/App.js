import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import * as Components from './component/index'; 
import { useConfigQuery } from './utils/Constants';
import logo from './logo.svg';
import './css/index.css';

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

  let Layout = Components['Layout_01'];
  let Header = Components['Header_01'];
  // let Footer = (<div>footer</div>);

  return (
    <Layout
      header={<Header/>}
      footer={"footer"}
    >
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route component={Components['Products']} path={'/main1'}/>
            <Route component={Main2} path={'/main2'}/> 
          </Switch>
      </BrowserRouter>
      </div>
    </Layout>
  );
}

export default App;
