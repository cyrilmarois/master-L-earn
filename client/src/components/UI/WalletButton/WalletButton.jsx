import React, { useEffect, useState } from "react";

const WalletButton = (props) => {
  const [walletName, setWalletName] = useState("");

  useEffect(() => {
    const transformName = () => {
      setWalletName(props.name.charAt(0).toUpperCase());
    };
    transformName();
  }, []);

  return (
    <button type="button" className={`btn ${props.name}`}>
      {walletName}
    </button>
  );
};

export default WalletButton;
