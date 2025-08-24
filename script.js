let provider, signer, contract;

const contractAddress = "0x467733de14652a22b8154562af82e9b205dc93f2"; // ganti dengan kontrak staking hasil deploy di Remix
const abi = [
  {
      "inputs": [{"internalType":"uint256","name":"amount","type":"uint256"}],
          "name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"
            },
              {
                  "inputs": [{"internalType":"uint256","name":"amount","type":"uint256"}],
                      "name":"unstake","outputs":[],"stateMutability":"nonpayable","type":"function"
                        },
                          {
                              "inputs": [{"internalType":"address","name":"user","type":"address"}],
                                  "name":"getStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
                                      "stateMutability":"view","type":"function"
                                        }
                                        ];

                                        document.getElementById("connectBtn").addEventListener("click", connectWallet);

                                        async function connectWallet() {
                                          if (window.ethereum) {
                                              provider = new ethers.providers.Web3Provider(window.ethereum);
                                                  await provider.send("eth_requestAccounts", []);
                                                      signer = provider.getSigner();
                                                          const address = await signer.getAddress();
                                                              document.getElementById("walletAddress").innerText = address;
                                                                  contract = new ethers.Contract(contractAddress, abi, signer);
                                                                      document.getElementById("walletInfo").style.display = "block";
                                                                          updateStake();
                                                                            } else {
                                                                                alert("Install MetaMask dulu!");
                                                                                  }
                                                                                  }

                                                                                  async function stake() {
                                                                                    const amount = document.getElementById("amount").value;
                                                                                      if (!amount || amount <= 0) return alert("Masukkan jumlah $tAIR!");
                                                                                        const tx = await contract.stake(ethers.utils.parseUnits(amount, 18));
                                                                                          await tx.wait();
                                                                                            updateStake();
                                                                                              alert("Stake berhasil!");
                                                                                              }

                                                                                              async function unstake() {
                                                                                                const amount = document.getElementById("amount").value;
                                                                                                  if (!amount || amount <= 0) return alert("Masukkan jumlah $tAIR!");
                                                                                                    const tx = await contract.unstake(ethers.utils.parseUnits(amount, 18));
                                                                                                      await tx.wait();
                                                                                                        updateStake();
                                                                                                          alert("Unstake berhasil!");
                                                                                                          }

                                                                                                          async function updateStake() {
                                                                                                            const address = await signer.getAddress();
                                                                                                              const staked = await contract.getStaked(address);
                                                                                                                document.getElementById("stakedAmount").innerText = ethers.utils.formatUnits(staked, 18);
                                                                                                                }
