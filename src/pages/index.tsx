import type { NextPage } from "next";
import Head from "next/head";
import { NFTStorage, File } from "nft.storage";
import Image from "next/image";
import Navigation from "../../components/NavBar";
import { CSSProperties, useEffect, useState } from "react";
import NFT from "../../../../artifacts/contracts/AINFT.sol/NFT.json";
import config from "../../config.json";
import { providers, Contract } from "ethers";
import axios from "axios";
import { ethers } from "ethers";
import process from "process";
import ClipLoader from "react-spinners/ClipLoader";
import { log } from "console";
const Home: NextPage = () => {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
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
  const loadBlockchain = async () => {
    const provider = new ethers.providers.AlchemyProvider(
      "goerli",
      "Xve7HjU7nIupIDJUd1zI22dH7yVXxL6Y"
    );
    setProvider(provider);
    console.log(provider);

    const network = await provider.getNetwork();
    console.log(network);

    const nft = new ethers.Contract(config[5].nft.address, NFT.abi, provider);
    console.log(nft);
    setNft(nft);
    const balance = await provider.getBalance(nft.address);
    console.log(balance.toString());

    // const name = await nft.name();
    // console.log(name);
    //
  };

  const mintImage = async (tokenURI: any) => {
    console.log("minting image...");

    const signer = await provider.getSigner();

    const transaction = await nft
      .connect(signer)
      .mint(tokenURI, { value: ethers.utils.parseUnits("1", "ether") });
    await transaction.wait();
  };

  const getTotalCreatedNft = async () => {
    const totalSupply = await nft.totalSupply();
    console.log(totalSupply);
    const number: any = totalSupply._hex;
    setTotalNft(number);
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
          dadada
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
          getTotalCreatedNft();
        }}
      >
        click
      </button>
    </div>
  );
};

export default Home;
