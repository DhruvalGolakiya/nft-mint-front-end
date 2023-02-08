import type { NextPage } from "next";
import Head from "next/head";
import { NFTStorage, File } from "nft.storage";
import Image from "next/image";
import { Network, Alchemy } from "alchemy-sdk";
import Navigation from "../../components/NavBar";
import { CSSProperties, useEffect, useState } from "react";
import { IpfsImage } from "react-ipfs-image";
// import NFT from "../../../../artifacts/contracts/AINFT.sol/NFT.json";
import config from "../../config.json";
import { providers, Contract } from "ethers";
import axios from "axios";
import { ethers } from "ethers";
import process from "process";
import ClipLoader from "react-spinners/ClipLoader";
import { log } from "console";
const Home: NextPage = () => {
  const URL =
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";
  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState<any>();
  const [img, setImg] = useState<any>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [nft, setNft] = useState<any>();
  const [totalNft, setTotalNft] = useState<any>();
  const [message, setMessage] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const setting: any = {
    network: "eth-goerli",
    apiKey: "Xve7HjU7nIupIDJUd1zI22dH7yVXxL6Y",
  };

  const loadBlockchain = async () => {
    console.log(account);
    const alchemy = new Alchemy(setting);
    // const provider = await alchemy.config.getProvider();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    // // console.log(provider);s
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const network = await signer.getChainId();
    console.log(network);
    // const walletAddress = (await window.ethereum.enable())[0];
    // console.log(walletAddress);
    const nft = new ethers.Contract(
      config[31337].nft.address,
      [
        {
          inputs: [
            {
              internalType: "string",
              name: "_name",
              type: "string",
            },
            {
              internalType: "string",
              name: "_symbol",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_cost",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "approved",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "ApprovalForAll",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "cost",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "getApproved",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "isApprovedForAll",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "tokenURI",
              type: "string",
            },
          ],
          name: "mint",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ownerOf",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "data",
              type: "bytes",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "setApprovalForAll",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "tokenURI",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      provider
    );
    console.log(nft);
    setNft(nft);
    const balance = await provider.getBalance(nft.address);
    // const name = await nft.cost();
    // console.log(name.toString() / 10 ** 18);
    //
  };

  const getOwner = async () => {
    const owner = await nft.owner();
    console.log(owner);
  };
  const mintImage = async (tokenURI: any) => {
    console.log(account);

    console.log("minting image...");
    // const signer = new ethers.providers.Web3Provider(
    //   window.ethereum
    // ).getSigner();
    const signer = await provider.getSigner(account);
    console.log(signer);

    console.log(signer);
    const transaction = await nft.connect(signer).mint(tokenURI, {
      value: ethers.utils.parseUnits("1", "ether"),
    });
    await transaction.wait();
    console.log(transaction);
  };

  const getAddressOfNFT = async () => {
    const totalSupply = await nft.tokenURI(1);
    console.log(totalSupply);
    // const number: any = totalSupply._hex;
    // setTotalNft(number);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();

    if (name === "" || description === "") {
      window.alert("Please provide a name and description");
      return;
    }
    setIsWaiting(true);

    const imageData = await createImage();

    const url = await uploadImage(imageData);
    // console.log(imageData);
    // console.log("submitting.....", name, description);

    await mintImage(url);
    setIsWaiting(false);
    setMessage("");

    console.log("success");
  };

  const createImage = async () => {
    console.log("Generating image.....");

    const response = await axios({
      url: URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NFT_AI_IMAGE_API}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      data: JSON.stringify({
        inputs: description,
        options: { wait_for_model: true },
      }),
      responseType: "arraybuffer",
    });

    const type = response.headers["content-type"];
    const data = response.data;

    const base64data = await Buffer.from(data).toString("base64");
    const image = `data:${type};base64,` + base64data;
    setImg(image);
    console.log("done");
    // console.log(image);

    return data;
  };

  const uploadImage = async (imageData: any) => {
    console.log("Uploading image ...");

    const nftStorage = new NFTStorage({
      token: process.env.NEXT_PUBLIC_NFT_STORAGE_API || "",
    });

    const { ipnft } = await nftStorage.store({
      image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
      name: name,
      description: description,
    });

    const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
    setUrl(url);

    return url;
  };

  useEffect(() => {
    loadBlockchain();
  }, []);
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("");
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "black",
  };
  return (
    <div className="container p-0 mx-auto bg-[#f1e8e8] h-[100vh] px-[40px]">
      <div className="pt-[50px]">
        <Navigation account={account} setAccount={setAccount} />
      </div>
      <div className="mt-[200px] justify-center gap-[40px]  mx-auto flex ">
        <form
          className="flex flex-col  justify-center items-center gap-[20px]"
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <input
            className="border-[black] border-[1px] rounded-[6px] w-full px-[10px] h-[45px]"
            type="text"
            placeholder="Create a name...."
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
          <input
            className="border-[black] border-[1px] rounded-[6px] w-full px-[10px] h-[45px]"
            type="text"
            placeholder="Create a description..."
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></input>
          <input
            className="border-[black] border-[1px] rounded-[6px] w-full  text-[20px] bg-[#6447e3] text-[#f1e8e8] h-[45px]"
            type="submit"
            value="Create & Mint"
          ></input>
        </form>
        <div className="bg-[white] h-[400px] w-[400px]  rounded-xl relative">
          {!isWaiting && img ? (
            <img src={img} alt="AI generated image" />
          ) : isWaiting ? (
            <div className="flex items-center justify-center mt-[45%]">
              <ClipLoader />
              <p>{message}</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="mx-auto justify-center items-center rounded-[6px] flex mt-[50px] bg-[#6447e3] w-fit px-[20px]  py-[10px] text-[#f1e8e8]">
        <p className="text-[20px]">
          View <a href={url}>Metadata</a>
        </p>
      </div>
      <div className="text-[20px] text-[red]">{totalNft}</div>
      <button
        onClick={() => {
          getAddressOfNFT();
        }}
      >
        click
      </button>
      <img src="https://ipfs.io/ipfs/QmQqzMTavQgT4f4T5v6PWBp7XNKtoPmC9jvn12WPT3gkSE" />
      {/* <IpfsImage
        hash="bafybeigxnjiqcc3gaz55nebavse2bwutzm5lv76ttxw422lwz5rhcgofuy"
        // gatewayUrl="https://ipfs.infura.io/ipfs"
      /> */}
    </div>
  );
};

export default Home;
