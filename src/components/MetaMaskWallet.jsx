import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import Transfer from './TransferForm'

const MetaMaskWallet = () => {
    const [errorMsg, setErrorMsg] = useState(null)
    const [error, setError] = useState()
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [userBalance, setUserBalance] = useState(null)
    const [connButtonText, setConnButtonText] = useState('Connect Wallet')
    const [provider, setProvider] = useState(null)

    const connectWalletHandler = async () => {
        if (window.ethereum && defaultAccount == null) {
            // set ethers provider
            setProvider(
                new ethers.providers.Web3Provider(window.ethereum, 'any')
            )
            console.log(window.ethereum.networkVersion)
            // connect to metamask
            try {
                let accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                })
                setConnButtonText('Wallet Connected. Disconnect Now.')
                setDefaultAccount(accounts[0])
            } catch (err) {
                setErrorMsg(err.message)
            }
        } else if (!window.ethereum) {
            toast.error('Please install MetaMask browser extension to interact')
        } else if (window.ethereum.isConnected()) {
            setDefaultAccount(null)
            setConnButtonText('Connect Wallet')
        }
    }

    useEffect(() => {
        if (defaultAccount) {
            provider.getBalance(defaultAccount).then((balanceResult) => {
                setUserBalance(ethers.utils.formatEther(balanceResult))
            })
        }
    }, [defaultAccount])

    const networks = {
        polygon: {
            chainId: `0x${Number(137).toString(16)}`,
            chainName: 'Polygon Mainnet',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
            },
            rpcUrls: ['https://polygon-rpc.com/'],
            blockExplorerUrls: ['https://polygonscan.com/'],
        },
        bsc: {
            chainId: `0x${Number(56).toString(16)}`,
            chainName: 'Binance Smart Chain Mainnet',
            nativeCurrency: {
                name: 'Binance Chain Native Token',
                symbol: 'BNB',
                decimals: 18,
            },
            rpcUrls: [
                'https://bsc-dataseed1.binance.org',
                'https://bsc-dataseed2.binance.org',
                'https://bsc-dataseed3.binance.org',
                'https://bsc-dataseed4.binance.org',
                'https://bsc-dataseed1.defibit.io',
                'https://bsc-dataseed2.defibit.io',
                'https://bsc-dataseed3.defibit.io',
                'https://bsc-dataseed4.defibit.io',
                'https://bsc-dataseed1.ninicoin.io',
                'https://bsc-dataseed2.ninicoin.io',
                'https://bsc-dataseed3.ninicoin.io',
                'https://bsc-dataseed4.ninicoin.io',
                'wss://bsc-ws-node.nariox.org',
            ],
            blockExplorerUrls: ['https://bscscan.com'],
        },
        rinkeby: {
            chainId: `0x${Number(4).toString(16)}`,
            chainName: 'Ethereum Testnet Rinkeby',
            nativeCurrency: {
                name: 'Rinkeby Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: ['https://rinkeby.infura.io/v3/'],
            blockExplorerUrls: ['https://rinkey.etherscan.io'],
        },
    }

    const changeNetwork = async ({ networkName, setError }) => {
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        ...networks[networkName],
                    },
                ],
            })
        } catch (err) {
            setError(err.message)
        }
    }

    const handleNetworkSwitch = async (networkName) => {
        setError()
        await changeNetwork({ networkName, setError })
    }

    // const networkChanged = (chainId) => {
    //     console.log({ chainId })
    // }

    // useEffect(() => {
    //     window.ethereum.on('chainChanged', networkChanged)
    //     console.log(window.ethereum.networkVersion)

    //     return () => {
    //         window.ethereum.removeListener('chainChanged', networkChanged)
    //     }
    // }, [])

    return (
        <div className='flex mx-10'>
            <div className='connectWallet'>
                <h1 className='font-bold text-2xl mb-5'>
                    Connect Your MetaMask Wallet
                </h1>
                <button
                    className='btn w-full mb-5'
                    onClick={connectWalletHandler}
                >
                    {connButtonText}
                </button>
                {defaultAccount && (
                    <div>
                        <p>Wallet Address: {defaultAccount} </p>
                        <p>Balance: {userBalance}</p>
                        {errorMsg}
                    </div>
                )}
                <hr className='solid' />
            </div>
            <div className='transfer'>
                {defaultAccount && (
                    <div className='ml-10 lg:w-1/2 sm:w-auto'>
                        <h1 className='mb-5 font-bold text-2xl'>
                            Make A Transfer
                        </h1>

                        <main>
                            <h1 className='text-2xl'>Choose A Network</h1>
                            <div className='flex mt-4'>
                                <button
                                    onClick={() =>
                                        handleNetworkSwitch('polygon')
                                    }
                                    className='mx-2 btn btn-primary'
                                >
                                    Switch to Polygon
                                </button>
                                <button
                                    onClick={() => handleNetworkSwitch('bsc')}
                                    className='mx-2 btn btn-warning text-white'
                                >
                                    Switch to BSC
                                </button>
                                <button
                                    onClick={() =>
                                        handleNetworkSwitch('rinkeby')
                                    }
                                    className='mx-2 btn btn-info text-white mb-5'
                                >
                                    Switch to Rinkeby
                                </button>
                            </div>
                        </main>
                        <Transfer />
                    </div>
                )}
            </div>
        </div>
    )
}

export default MetaMaskWallet
