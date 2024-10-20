// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Interface for ERC20 tokens like USDC
interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract NotaryPayment {
    
    address public owner;
    address public usdcAddress;

    // Constructor sets the owner of the contract and USDC contract address
    constructor(address _usdcAddress) {
        owner = msg.sender;
        usdcAddress = _usdcAddress;
    }

    // Modifier to restrict actions to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function payFee(uint256 amount) public {
        require(amount > 0, "Fee must be greater than 0");

        // Transfer USDC from the user to this contract
        IERC20 usdc = IERC20(usdcAddress);
        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");
    }

    // Function for the owner to withdraw all USDC from the contract
    function withdrawFunds() public {
        require(msg.sender == owner, "Only owner can perform this action");

        IERC20 usdc = IERC20(usdcAddress);
        uint256 balance = usdc.balanceOf(address(this));
        require(balance > 0, "No USDC available to withdraw");

        require(usdc.transfer(owner, balance), "Withdrawal failed");
    }
}
