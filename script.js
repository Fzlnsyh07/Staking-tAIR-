let provider, signer, stakingContract;

const stakingAddress = "0x5393aBE6CE6fF2BD32fb4FA962D75B9cA3ae07D3"; // ganti dgn address staking contract
const stakingABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
  // contoh minimal ABI
  "function stake(uint256 amount) public",
  "function unstake(uint256 amount) public",
  "function getStake(address user) public view returns (uint256)"
];

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = "Connected: " + address;

    // load contract
    stakingContract = new ethers.Contract(stakingAddress, stakingABI, signer);

    // tampilkan menu staking
    document.getElementById("stakingMenu").style.display = "block";

    // update info stake user
    updateStakeInfo(address);
  } else {
    alert("MetaMask tidak terdeteksi!");
  }
}

async function stakeTokens() {
  const amount = document.getElementById("stakeAmount").value;
  try {
    const tx = await stakingContract.stake(ethers.utils.parseEther(amount));
    await tx.wait();
    alert("✅ Staking berhasil!");
    updateStakeInfo(await signer.getAddress());
  } catch (err) {
    console.error(err);
    alert("❌ Gagal staking: " + err.message);
  }
}

async function unstakeTokens() {
  const amount = document.getElementById("stakeAmount").value;
  try {
    const tx = await stakingContract.unstake(ethers.utils.parseEther(amount));
    await tx.wait();
    alert("✅ Unstake berhasil!");
    updateStakeInfo(await signer.getAddress());
  } catch (err) {
    console.error(err);
    alert("❌ Gagal unstake: " + err.message);
  }
}

async function updateStakeInfo(user) {
  try {
    const stake = await stakingContract.getStake(user);
    document.getElementById("stakeInfo").innerText =
      "Staked: " + ethers.utils.formatEther(stake) + " $tAIR";
  } catch (err) {
    console.error(err);
  }
}
