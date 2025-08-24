const stakingAddress = "0x8166fd5fab2e7397ea29cab15371a1caf0fd63f0";
const tokenAddress = "0x6ce343073c191560b018dc5eaab6568945ba1e90";

// ABI staking contract (dari kamu)
const stakingABI = [
  { "inputs": [], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "stake", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "unstake", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }], "name": "pendingReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

// Minimal ERC20 ABI untuk approve
const tokenABI = [
  { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
];

let web3;
let accounts;
let stakingContract;
let tokenContract;

document.getElementById("connectButton").onclick = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
    stakingContract = new web3.eth.Contract(stakingABI, stakingAddress);
    tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

    document.getElementById("walletAddress").innerText = accounts[0];
    document.getElementById("app").style.display = "block";
    updateInfo();
  } else {
    alert("Please install MetaMask!");
  }
};

async function updateInfo() {
  if (!stakingContract) return;
  const staked = await stakingContract.methods.balanceOf(accounts[0]).call();
  const reward = await stakingContract.methods.pendingReward(accounts[0]).call();

  document.getElementById("stakedBalance").innerText = web3.utils.fromWei(staked, "ether");
  document.getElementById("pendingReward").innerText = web3.utils.fromWei(reward, "ether");
}

document.getElementById("stakeButton").onclick = async () => {
  const amount = document.getElementById("stakeAmount").value;
  if (!amount) return alert("Enter amount");

  const weiAmount = web3.utils.toWei(amount, "ether");

  await tokenContract.methods.approve(stakingAddress, weiAmount).send({ from: accounts[0] });
  await stakingContract.methods.stake(weiAmount).send({ from: accounts[0] });

  updateInfo();
};

document.getElementById("unstakeButton").onclick = async () => {
  const amount = document.getElementById("unstakeAmount").value;
  if (!amount) return alert("Enter amount");

  const weiAmount = web3.utils.toWei(amount, "ether");

  await stakingContract.methods.unstake(weiAmount).send({ from: accounts[0] });
  updateInfo();
};

document.getElementById("claimButton").onclick = async () => {
  await stakingContract.methods.claim().send({ from: accounts[0] });
  updateInfo();
};
