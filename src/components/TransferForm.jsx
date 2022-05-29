import { useState } from 'react'

// import Web3 from 'web3'

function TransferFrom() {
    return (
        <section className='form'>
            <form className='flex flex-col'>
                <div className='form-group'>
                    <label htmlFor='dest'>Destination Address</label>
                    <input type='text' placeholder='Destination Address' />
                </div>
                <div className='form-group'>
                    <label htmlFor='amount'>Amount</label>
                    <input type='text' placeholder='Amount' />
                </div>
                <button className='btn'>Transfer Now</button>
            </form>
        </section>
    )
}
export default TransferFrom
