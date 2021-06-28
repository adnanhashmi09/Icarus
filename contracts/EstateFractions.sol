// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract EstateFractions {

    function name() public view virtual returns (string memory);
    function symbol() public view virtual returns (string memory);
    function Price() public view virtual returns (uint);
    function totalSupply() public view virtual returns (uint256);

    function balanceOf(address account) public view virtual returns (uint);
    function transferAndSet(address sender, address recipient, uint256 amount, uint256 price) public virtual returns (bool);
    
}


