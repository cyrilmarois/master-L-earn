import logo from "../../../images/mle-logov2-sm.png";
import SubHeader from "./SubHeader/SubHeader";
import React, { useEffect } from "react";
import { useState } from "react";
import useEth from "../../../contexts/EthContext/useEth";
import "./Header.css";
import { Toaster } from "react-hot-toast";

const Header = () => {
  const [loggedAddress, setLoggedAddress] = useState("Connexion");
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isRecruiter, setIsRecruiter] = useState(false);

  const {
    state: { contractMLE, accounts },
  } = useEth();

  const handleConnexion = async () => {
    if (accounts && accounts[0]) {
      const addressConnexion = transformAddress(accounts[0]);
      setLoggedAddress(addressConnexion);
    }
  };

  // LATER multiple wallet managment
  // useEffect(() => {
  //   const checkWallets = () => {
  //     const tmpWallets = JSON.parse(localStorage.getItem("wallets"));
  //     if (tmpWallets === null) {
  //       let wallets = { metamask: false };
  //       if (typeof window.ethereum !== "undefined") {
  //         console.log("MetaMask is installed!");
  //         wallets.metamask = true;
  //       }
  //       console.log({ wallets });
  //       localStorage.setItem("wallets", JSON.stringify(wallets));
  //     }
  //   };
  //   checkWallets();
  // }, []);

  const transformAddress = (account) => {
    return account.slice(0, 5) + "..." + account.slice(-4);
  };

  useEffect(() => {
    if (contractMLE && accounts && accounts[0]) {
      const addressConnexion = transformAddress(accounts[0]);
      setLoggedAddress(addressConnexion);
      const getProfileInfo = async () => {
        try {
          let teacherAddress, studentAddress, recruiterAddress;
          const teachersAddresses = await contractMLE.methods
            .getTeachersAddresses()
            .call({ from: accounts[0] });
          if (teachersAddresses.length > 0) {
            teacherAddress = teachersAddresses.find(
              (addr) => addr === accounts[0]
            );
            if (teacherAddress !== undefined) {
              setIsTeacher(true);
            }
          }
          const studentsAddresses = await contractMLE.methods
            .getStudentsAddress()
            .call({ from: accounts[0] });
          if (studentsAddresses.length > 0) {
            studentAddress = studentsAddresses.find(
              (addr) => addr === accounts[0]
            );
            if (studentAddress !== undefined) {
              setIsStudent(true);
            }
          }
          const recruitersAddresses = await contractMLE.methods
            .getRecruitersAddress()
            .call({ from: accounts[0] });
          if (recruitersAddresses.length > 0) {
            recruiterAddress = recruitersAddresses.find(
              (addr) => addr === accounts[0]
            );
            if (recruiterAddress !== undefined) {
              setIsRecruiter(true);
            }
          }
          console.log({
            teachersAddresses,
            teacherAddress,
            studentsAddresses,
            studentAddress,
            recruitersAddresses,
            recruiterAddress,
          });
        } catch (e) {
          console.error(e);
        }
      };
      getProfileInfo();
    }
  }, [contractMLE, accounts]);

  return (
    <>
      <div>
        <Toaster />
      </div>
      <header>
        <div className="container">
          <div id="header" className="row align-items-center">
            <div className="col-1">
              <div id="logo">
                <img src={logo} alt="logo" />
              </div>
            </div>
            <div className="col-11 align-items-center">
              <div className="row">
                <div className="col-12">
                  <form className="row" role="search">
                    <div className="col-6 ms-3">
                      <input
                        className="form-control"
                        type="search"
                        placeholder="Rechercher"
                        aria-label="Search"
                      />
                    </div>

                    <div className="col-2 offset-3">
                      <a
                        id="connect"
                        // onClick={handleConnexion}
                        role="button"
                        href="/register"
                        className="btn btn-metamask"
                      >
                        {isTeacher ? (
                          <a href="/teacher" className="link-role">
                            <span className="fa-solid fa-person-chalkboard pe-3"></span>
                          </a>
                        ) : (
                          ""
                        )}

                        {isStudent ? (
                          <a href="/student" className="link-role">
                            <span className="fa-solid fa-graduation-cap pe-3"></span>
                          </a>
                        ) : (
                          ""
                        )}

                        {isRecruiter ? (
                          <a href="/recruiter" className="link-role">
                            <span className="fa-solid fa-handshake pe-3"></span>
                          </a>
                        ) : (
                          ""
                        )}

                        {loggedAddress}
                      </a>
                    </div>
                  </form>
                </div>
                <div className="col-12">
                  <SubHeader />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
