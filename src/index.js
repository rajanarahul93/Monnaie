import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import { Web3ReactProvider } from '@web3-react/core'

import { ethers } from 'ethers'

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 8000 
  return library
}

const getChainId = (provider) => {
  const library = new ethers.providers.Web3Provider(provider)
  return library.chainId
}
ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary} chainId={getChainId}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)


reportWebVitals()
