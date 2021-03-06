import React from 'react';
import ReactDOM from 'react-dom';
import { 
  // BrowserRouter as Router,
  HashRouter as Router,
} from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import './index.css';
import App from './App';
import ApolloClientAPI from './utils/ApolloClientAPI';
import * as serviceWorker from './serviceWorker';

const theClientAPI = ApolloClientAPI();
export default theClientAPI;
const { client, cache, ...restClient } = theClientAPI;
client.writeData({
  data: {
    config: null,
    cart: null,
    customer: null
  }
})
ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App/>
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
);
// ReactDOM.render(
//   <React.StrictMode>
//       <ApolloProvider client={client}>
//         <App/>
//       </ApolloProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
