import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMoon, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Modal } from 'antd';
import { LogoutOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';

import { useWeb3React } from '@web3-react/core';
import { injected } from '../../hooks/connect';
import useThemeSwitcher from '../../hooks/useThemeSwitcher';
import { switchSongbirdNetwork } from '../../hooks/switch-network';

import logoDark from '../../assets/images/logo-ct-dark.png';
import logoLight from '../../assets/images/logo-ct.png';
import walletIcon from '../../assets/images/walletIcon.svg';

const Navbar = () => {
  const { account, chainId, activate, deactivate } = useWeb3React();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function connect() {
    if (chainId !== 19 || chainId === undefined) {
      switchSongbirdNetwork();
    }
    try {
      await activate(injected);
      localStorage.setItem('isWalletConnected', true);
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem('isWalletConnected', false);
      window.location.reload();
    } catch (ex) {
      console.log(ex);
    }
  }

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('isWalletConnected') === 'true') {
        try {
          await activate(injected);
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, [activate]);

  const [activeTheme, setTheme] = useThemeSwitcher();

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id="nav"
      className="w-full">
      <div className="flex justify-between items-center px-4 py-6 w-full">
        <Link to="/">
          <div className="flex">
            <img src={activeTheme === 'dark' ? logoDark : logoLight} className="w-10" alt="Logo" />
            <h1 className={`font-bold p-2 ${activeTheme === 'dark' ? 'text-black' : 'text-white'}`}>NFT Emporium</h1>
          </div>
        </Link>
        <div className="flex items-center">
        <button
          onClick={() => setTheme(activeTheme === 'light' ? 'dark' : 'light')} 
          className="bg-gray-100 dark:bg-ternary-dark p-2 rounded-xl mr-4 transition-all duration-300">
          {activeTheme === 'dark' ? (
            <FiSun className="text-yellow-500 text-xl" /> 
          ) : (
            <FiMoon className="text-gray-700 text-xl" />
          )}
        </button>
          {!account ? (
            <button onClick={connect} className="flex items-center bg-transparent bg-gradient-to-r from-purple-700 to-pink-600 hover:text-gray-300 duration-300 font-general-medium px-6 py-2.5 rounded-md shadow-sm text-md text-white font-bold">
              <img src={walletIcon} alt="Wallet Icon" className="mr-2 w-5" />
              Connect Wallet
            </button>
          ) : (
            <button onClick={openModal} className="flex items-center bg-transparent bg-gradient-to-r from-purple-700 to-pink-600 hover:text-gray-300 duration-300 font-general-medium px-6 py-2.5 rounded-md shadow-sm text-md text-white font-bold">
              <img src={walletIcon} alt="Wallet Icon" className="mr-2 w-5" />
              {account.toString().slice(0, 4)}...{account.toString().slice(-4)}
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal
          title=""
          open={isModalOpen}
          footer={null}
          onCancel={() => setIsModalOpen(false)}
          closable={false}
          className={activeTheme === 'dark' ? 'lightModal' : 'darkModal'}
          width={400}>
          <div className="flex justify-center mb-4">
            <div className={`flex p-2 rounded-lg ${activeTheme === 'dark' ? 'bg-white text-black' : 'bg-ternary-dark text-gray-300'}`}>
              <span className="pr-2">{account ? `${account.toString().slice(0, 32)}...` : ''}</span>
              <CopyToClipboard text={account ?? ''} onCopy={onCopyText}>
                <button className="pl-3">
                  {!isCopied ? <CopyOutlined className="text-lg" /> : <CheckOutlined className="text-lg" />}
                </button>
              </CopyToClipboard>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={disconnect} className="flex items-center bg-transparent dark:border-2 bg-gradient-to-r from-purple-700 to-pink-600 hover:text-gray-400 duration-300 font-general-medium rounded-md shadow-sm text-md text-white font-bold p-2">
              Disconnect
              <LogoutOutlined className="pl-1" />
            </button>
          </div>
        </Modal>
      )}
    </motion.nav>
  );
};

export default Navbar;
