import { useState } from "react";
import Web3 from "web3";
import { Magic } from "magic-sdk";
import { ConnectExtension } from "@magic-ext/connect";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import "./styles.css";

const magic = new Magic(process.env.REACT_APP_MAGIC_MAGIC_PK, {
  network: {
    rpcUrl: process.env.REACT_APP_RPC,
    chainId: process.env.REACT_APP_CHAIN_ID,
  },
  locale: "es",
  extensions: [new ConnectExtension()]
});
const web3 = new Web3(magic.rpcProvider);

export default function App() {
  const [account, setAccount] = useState(null);
  const [clicked, setClicked] = useState(false);

  // ==== Toast ====

  const sendTx = () => {
    toast.promise(
      sendTransaction,
      {
        pending: 'Sending 💰',
        success: 'Thanks for your ☕',
        error: 'Something went wrong 🤯'
      }
    );
  }
  
  const walletInjected = () => {
    toast.error("You're using a web3 wallet injected", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  // ====       ====

  const login = async () => {
    setClicked(true)
    web3.eth
      .getAccounts()
      .then((accounts) => {
        console.log(accounts)
        setAccount(accounts?.[0]);
      })
      .catch((error) => {
        setClicked(false)
        console.log(error);
      });
  };

  const sendTransaction = async () => {
    const publicAddress = (await web3.eth.getAccounts())[0];
    let gasPrice = await web3.eth.getGasPrice()
    console.log("")
    const txnParams = {
      from: publicAddress,
      to: process.env.REACT_APP_WALLET,
      value: web3.utils.toWei(process.env.REACT_APP_COFFEE_PRICE, "ether"),
      gasPrice: gasPrice
    };
    return web3.eth
      .sendTransaction(txnParams)
      .on("transactionHash", (hash) => {
        console.log("Transaction Hash: ", hash);
      })
      .then((receipt) => {
        console.log("Transaction Receipt: ", receipt);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showWallet = () => {
    magic.connect.showWallet().catch((e) => {
      console.log(e);
      if(e.toString().includes("User denied account access")){
        walletInjected()
      }
    });
  };

  const disconnect = async () => {
    await magic.connect.disconnect().catch((e) => {
      console.log(e);
    });
    setClicked(false)
    setAccount(null);
  };

  return (
    <div className="app">
      {!account && (
        <div>
          <br />
          <button onClick={login} className="button-row" disabled={clicked}>
            Login
          </button>
        </div>
      )}

      {account && (
        <>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <button onClick={showWallet} className="button-row">
            Magic Wallet
          </button>
          <button onClick={sendTx} className="button-row">
            Buy me a coffee
          </button>
          <br /> 
          <button onClick={disconnect} className="button-row">
            Disconnect
          </button>
        </>
      )}
    </div>
  );
}
