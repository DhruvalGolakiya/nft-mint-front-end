import { ethers } from "ethers";
import { useEffect } from "react";

const Navigation = ({ account, setAccount }: any) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.utils.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <nav className="flex justify-between  container mx-auto    ">
      <div className="text-[#6447e3] font-[600] text-[30px]">
        <h1>AI NFT Generator</h1>
      </div>
      <div className="text-[20px]  text-[#f1e8e8]  bg-[#6447e3] justify-center items-center flex px-[20px] rounded-xl">
        {account ? (
          <button type="button" className="nav__connect">
            {account.slice(0, 6) + "..." + account.slice(38, 42)}
          </button>
        ) : (
          <button
            type="button"
            className="nav__connect"
            onClick={connectHandler}
          >
            Connect
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
