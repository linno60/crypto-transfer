import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import Transfer from './Transfer'

const MetaMaskWallet = () => {
    const [errorMsg, setErrorMsg] = useState(null)
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [userBalance, setUserBalance] = useState(null)
    const [connButtonText, setConnButtonText] = useState('Connect Wallet')
    const [provider, setProvider] = useState(null)

    const connectWalletHandler = () => {
        if (window.ethereum && defaultAccount == null) {
            // set ethers provider
            setProvider(new ethers.providers.Web3Provider(window.ethereum))

            // connect to metamask
            window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then((result) => {
                    setConnButtonText('Wallet Connected')
                    setDefaultAccount(result[0])
                })
                .catch((error) => {
                    setErrorMsg(error.message)
                })
        } else if (!window.ethereum) {
            toast.error('Please install MetaMask browser extension to interact')
        }
    }

    useEffect(() => {
        if (defaultAccount) {
            provider.getBalance(defaultAccount).then((balanceResult) => {
                setUserBalance(ethers.utils.formatEther(balanceResult))
            })
        }
    }, [defaultAccount])

    return (
        <div className='flex justify-center'>
            <div>
                <h1 className='font-bold text-2xl'>
                    Connect Your MetaMask Wallet
                </h1>
                <br />
                <button className='btn w-full' onClick={connectWalletHandler}>
                    {connButtonText}
                </button>
                <br />
                <br />
                <hr className='solid'></hr>
                {defaultAccount && (
                    <div>
                        <p>Address Wallet: {defaultAccount} </p>
                        <p>Balance: {userBalance} Eth</p>
                        {errorMsg}
                        <Transfer />
                    </div>
                )}
            </div>
        </div>
    )
}

export default MetaMaskWallet
