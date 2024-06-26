import Layout from "../src/layout/Layout";
import { useState } from "react";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { dataLength, formatEther, getAddress, parseEther } from "ethers";
import { BrowserProvider, Contract } from "ethers";
import ABI from "../src/components/ABI.json";
import PageBanner from "../src/layout/PageBanner";

const Profile = () => {
  const [myContract, setContract] = useState({});
  const [load, setLoad] = useState(true);
  const [items, setItems] = useState([]);

  const contractAddress = "0xe87686DA664Aff3c11E1DD93514c565Dd79F763F";

  const projectId = "e1b5abe839a71edd27768a2617f23b97";

  // 2. Set chains
  const mainnet = {
    chainId: 11155111,
    name: "Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia.etherscan.io/",
    rpcUrl: "https://sepolia.drpc.org",
  };

  // 3. Create a metadata object
  const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "https://mywebsite.com", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
  };

  // 4. Create Ethers config
  const ethersConfig = defaultConfig({
    /*Required*/
    metadata,

    /*Optional*/
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    rpcUrl: "...", // used for the Coinbase SDK
    defaultChainId: 1, // used for the Coinbase SDK
  });

  // 5. Create a Web3Modal instance
  createWeb3Modal({
    ethersConfig,
    chains: [mainnet],
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
  });

  const { isConnected, address } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();

  async function getData() {
    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const myContract = new Contract(contractAddress, ABI, signer);
    const balance = Number(await myContract.balanceOf(address));
    let items = [];
    for (let i = 0; i < balance; i++) {
      const item = await myContract.tokenOfOwnerByIndex(address, i);
      const uri = await myContract.tokenURI(item);
      const serie = Number(await myContract.tokenToPayBackID(item));
      // use uri to fetch the nft metadata stored on ipfs
      const response = await fetch(uri);
      const metadata = await response.json();
      // get total price of item (item price + fee)
      items.push({
        itemId: item,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        serie: serie,
      });
    }
    setItems(items);
    setContract(myContract);
  }

  async function sell(e) {}

  if (load && walletProvider) {
    getData();
  }

  return (
    <Layout
      pageTitle={"Profile"}
      fnc={open}
      connected={isConnected}
      addr={address}
    >
      <PageBanner pageName={"Profile"} />

      {/* Collection Page */}
      <div className="metaportal_fn_collectionpage">
        <div className="container">
          <div className="metaportal_fn_collection">
            {/* Filters */}

            {/* !Filters */}
            <div className="metaportal_fn_clist">
              {/* Result Box */}
              {/* Result List */}
              <div className="metaportal_fn_result_list">
                <div className="metaportal_fn_drops">
                  <ul className="grid">
                    {items &&
                      items.map((nft, i) => (
                        <li key={i}>
                          <div className="nft__item">
                            <div className="img_holder">
                              <img src={nft.image} alt="" />
                              <Link href="#">
                                <a className="full_link" />
                              </Link>
                            </div>
                            <div className="title_holder">
                              <h3 className="fn_title">
                                <Link href="#">{nft.name}</Link>
                                {/* {`/nft/${nft.id}`} */}
                              </h3>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              {/* !Result List */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
