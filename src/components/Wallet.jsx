import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import erc20Abi from '../abis/erc20Abi.json'
import erc721Abi from '../abis/erc721Abi.json'
import erc1155Abi from '../abis/erc1155Abi.json'

const Wallet = () => {
    const [contractAddress, setContractAddress] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [balance, setBalance] = useState(null)
    const [connButtonText, setConnButtonText] = useState('Connect Wallet')

    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [contract, setContract] = useState(null)
    const [abi, setAbi] = useState(null)

    const [transferHash, setTransferHash] = useState(null)

    // Connect to Metamask
    const connectWalletHandler = async () => {
        if (window.ethereum && defaultAccount == null) {
            // set ethers provider
            setProvider(new ethers.providers.Web3Provider(window.ethereum))

            console.log(window.ethereum.networkVersion)
            // connect to metamask
            try {
                let accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                })
                setConnButtonText('Wallet Connected. Disconnect Now.')
                setDefaultAccount(accounts[0])
            } catch (err) {
                setErrorMessage(err.message)
            }
        } else if (!window.ethereum) {
            toast.error('Please install MetaMask browser extension to interact')
        } else if (window.ethereum.isConnected()) {
            setDefaultAccount(null)
            setConnButtonText('Connect Wallet')
        }
    }

    // Get user balance after connected to wallet
    useEffect(() => {
        if (defaultAccount) {
            provider.getBalance(defaultAccount).then((balanceResult) => {
                setBalance(ethers.utils.formatEther(balanceResult))
            })
        }
    }, [defaultAccount])

    // Supported Networks Info
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
        /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        RINKEBY function is currently NOT WORKING
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        */
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

    // Switch Networks
    const changeNetwork = async ({ networkName, setErrorMessage }) => {
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
            setErrorMessage(err.message)
        }
    }

    // Trigger Change Network after click
    const handleNetworkSwitch = async (networkName) => {
        setErrorMessage()
        await changeNetwork({ networkName, setErrorMessage })
    }

    const chainChangedHandler = () => {
        // reload the page to avoid any errors with chain change mid use of application
        window.location.reload()
    }

    window.ethereum.on('chainChanged', chainChangedHandler)

    // Create contract object
    useEffect(() => {
        if (contractAddress) {
            let tempSigner = provider.getSigner()
            setSigner(tempSigner)

            let tempContract = new ethers.Contract(
                contractAddress,
                abi,
                tempSigner
            )
            setContract(tempContract)
        }
    }, [contractAddress])

    // Transfer functions
    const erc20TransferHandler = async (e) => {
        e.preventDefault()

        let sendAmount = e.target.sendAmount.value
        let destAddress = e.target.destAddress.value

        let txt = await contract.transfer(destAddress, sendAmount)
        console.log(txt)
        setTransferHash('Transfer confirmation hash: ' + txt.hash)
    }

    /*
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        TO DO: erc 721 && 1155 transfer functions
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */
    const erc721TransferHandler = async (e) => {
        e.preventDefault()

        let itemId = e.target.itemId.value
        let destAddress = e.target.destAddress.value

        let txt = await contract.transfer(destAddress, itemId)
        console.log(txt)
        setTransferHash('Transfer confirmation hash: ' + txt.hash)
    }

    const erc1155TransferHandler = () => {}

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
                        <p>Balance: {balance}</p>
                        {errorMessage}
                    </div>
                )}
                <hr className='solid' />
            </div>
            <div className='transfer'>
                {defaultAccount && (
                    <div className='flex flex-col ml-10 lg:w-1/2 sm:w-auto'>
                        <h1 className='mb-5 font-bold text-2xl'>
                            Make A Transfer
                        </h1>

                        {window.ethereum.networkVersion ===
                        ('137' || '56' || '4') ? (
                            <>
                                <div className='mb-2.5'>
                                    <h3 className='mb-2.5'>
                                        Specify the token standard
                                    </h3>
                                    <div className='button-group flex mb-2.5'>
                                        <button
                                            onClick={() => setAbi(erc20Abi)}
                                            className='btn btn-outline'
                                        >
                                            ERC 20
                                        </button>
                                        <button
                                            onClick={() => setAbi(erc721Abi)}
                                            className='btn btn-outline'
                                        >
                                            ERC 721
                                        </button>
                                        <button
                                            onClick={() => setAbi(erc1155Abi)}
                                            className='btn btn-outline'
                                        >
                                            ERC 1155
                                        </button>
                                    </div>
                                </div>
                                {abi === erc20Abi ? (
                                    <section className='form'>
                                        <form
                                            className='flex flex-col'
                                            onSubmit={erc20TransferHandler}
                                        >
                                            <div className='form-group'>
                                                <label htmlFor='contract'>
                                                    Contract Address
                                                </label>
                                                <input
                                                    onChange={(e) =>
                                                        setContractAddress(
                                                            e.target.value
                                                        )
                                                    }
                                                    type='text'
                                                    id='contractAddress'
                                                    placeholder='Contract Address'
                                                />
                                            </div>

                                            <div className='form-group'>
                                                <label htmlFor='amount'>
                                                    Amount
                                                </label>
                                                <input
                                                    type='text'
                                                    id='sendAmount'
                                                    placeholder='Amount'
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='dest'>
                                                    Destination Address
                                                </label>
                                                <input
                                                    type='text'
                                                    id='destAddress'
                                                    placeholder='Destination Address'
                                                />
                                            </div>
                                            <button
                                                className='btn'
                                                type='submit'
                                            >
                                                Transfer Now
                                            </button>
                                            <div>{transferHash}</div>
                                        </form>
                                    </section>
                                ) : (
                                    <></>
                                )}
                                {abi === erc721Abi ? (
                                    <section className='form'>
                                        <form
                                            className='flex flex-col'
                                            onSubmit={erc721TransferHandler}
                                        >
                                            <div className='form-group'>
                                                <label htmlFor='contract'>
                                                    Contract Address
                                                </label>
                                                <input
                                                    onChange={(e) =>
                                                        setContractAddress(
                                                            e.target.value
                                                        )
                                                    }
                                                    type='text'
                                                    id='contractAddress'
                                                    placeholder='Contract Address'
                                                />
                                            </div>

                                            <div className='form-group'>
                                                <label htmlFor='contract'>
                                                    Item ID
                                                </label>
                                                <input
                                                    type='text'
                                                    id='itemId'
                                                    placeholder='Item ID'
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='dest'>
                                                    Destination Address
                                                </label>
                                                <input
                                                    type='text'
                                                    id='destAddress'
                                                    placeholder='Destination Address'
                                                />
                                            </div>
                                            <button
                                                className='btn'
                                                type='submit'
                                            >
                                                Transfer Now
                                            </button>
                                            <div>{transferHash}</div>
                                        </form>
                                    </section>
                                ) : (
                                    <></>
                                )}
                                {abi === erc1155Abi ? (
                                    <section className='form'>
                                        <form
                                            className='flex flex-col'
                                            onSubmit={erc1155TransferHandler}
                                        >
                                            <div className='form-group'>
                                                <label htmlFor='contract'>
                                                    Contract Address
                                                </label>
                                                <input
                                                    onChange={(e) =>
                                                        setContractAddress(
                                                            e.target.value
                                                        )
                                                    }
                                                    type='text'
                                                    id='contractAddress'
                                                    placeholder='Contract Address'
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='contract'>
                                                    Item ID
                                                </label>
                                                <input
                                                    type='text'
                                                    id='itemId'
                                                    placeholder='Item ID'
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='amount'>
                                                    Amount
                                                </label>
                                                <input
                                                    type='text'
                                                    id='sendAmount'
                                                    placeholder='Amount'
                                                />
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='dest'>
                                                    Destination Address
                                                </label>
                                                <input
                                                    type='text'
                                                    id='destAddress'
                                                    placeholder='Destination Address'
                                                />
                                            </div>
                                            <button
                                                className='btn'
                                                type='submit'
                                            >
                                                Transfer Now
                                            </button>
                                            <div>{transferHash}</div>
                                        </form>
                                    </section>
                                ) : (
                                    <></>
                                )}
                            </>
                        ) : (
                            <div>
                                <h3 className='mb-2.5'>
                                    Choose A Supported Network
                                </h3>
                                <div className='button-group flex'>
                                    <button
                                        onClick={() =>
                                            handleNetworkSwitch('polygon')
                                        }
                                        className='btn btn-outline'
                                    >
                                        Polygon
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleNetworkSwitch('bsc')
                                        }
                                        className='btn btn-outline'
                                    >
                                        BSC
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleNetworkSwitch('rinkeby')
                                        }
                                        className='btn btn-outline mb-2.5'
                                    >
                                        Rinkeby
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Wallet
