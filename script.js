async function connectWallet() {
  // Cek apakah MetaMask tersedia
  if (typeof window.ethereum !== "undefined") {
    console.log("✅ MetaMask terdeteksi");

    try {
      // Minta akses akun
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Ambil account pertama
      const account = accounts[0];
      console.log("🔗 Connected:", account);

      // Tampilkan di halaman
      document.getElementById("walletAddress").innerText =
        "Connected: " + account;
    } catch (error) {
      console.error("❌ Gagal connect:", error);
      alert("Gagal connect ke wallet. Coba ulangi lagi.");
    }
  } else {
    console.warn("⚠️ MetaMask tidak ditemukan");
    alert("⚠️ MetaMask tidak ditemukan. Buka website ini di browser MetaMask.");
  }
}
