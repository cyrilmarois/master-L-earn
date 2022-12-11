import "./Home.css";
import profile1 from "../../../images/profile-1-2.jpg";
import profile2 from "../../../images/profile-2-2.jpg";
import React from "react";

const Home = () => {
  return (
    <div id="home">
      <div className="header d-flex justify-content-center align-items-center">
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1 className="slogan display-4">Master L&Earn</h1>
            <p className="lead">Apprendre n'aura jamais autant un plaisir !</p>
          </div>
        </div>
      </div>
      <section className="container py-5 d-flex justify-content-around">
        <div className="bloc1 col-4 p-3 text-center">
          <i className="icon fa-solid fa-graduation-cap"></i>
          <h3>Apprenez tout en gagnant !</h3>
          Le prix de la formation ne doit plus etre un barrage. Montrez votre
          détermination au travers de formations de qualités et recevez le
          remboursemement jusqu'a 50% de ce que vous l'avez payez !
        </div>
        <div className="bloc2 col-4 p-3 text-center">
          <i className="icon fa-solid fa-rocket"></i>
          <h3>Booster vos chances !</h3>
          Vos compétences nous tiennent à coeur mais encore plus aux recruteurs
          ! Les SBT que vous remporterez pour chaque certification attesteront
          de vos acquis ! Ils seront directement liés à votre adresse de wallet.
        </div>
        <div className="bloc3 col-4 p-3 text-center">
          <i className="icon fa-solid fa-people-roof"></i>
          <h3>Integrez la communauté !</h3>
          Evaluez vos formations, prenez part à la vie de la plateforme grace a
          notre DAO ! Il sera également possible de soutenir Master L&Earn via
          divers plans de staking allant de 12 a 24 mois !
        </div>
      </section>
      <section className="topic-1 py-5">
        <div className="container text-center">
          <p>
            Master L&Earn veut être le COMMUN des talents du Web3. Une
            plateforme E-Learning, de confiance, certifiante et reconnaissante,
            <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
              un Coursera décentralisé et augmenté
            </span>{" "}
            qui répond aux enjeux du marché de la Formation de demain. Pour vous
            apprenants, une employabilité certifiée tout en protégeant votre
            identité. Pour vous formateurs, des opportunités de partager
            librement et d'être rémunéré facilement. Enfin pour vous employeurs,
            un sourcing alternatif crédible et sécurisé.
          </p>
        </div>
      </section>
      <section className="testimonies py-3">
        <h1 className="text-center pt-3 mb-3">Ils ont appris avec nous !</h1>

        <div className="container py-5 d-flex justify-content-around">
          <div className="testimony col-3 p-3 text-center">
            <figure>
              <blockquote className="blockquote">
                Nullam et tellus sit amet leo dignissim bibendum. Mauris iaculis
                sollicitudin sapien sed vestibulum. Quisque vitae porttitor
                felis, ac sodales lacus.
              </blockquote>
              <img src={profile1} />
              <figcaption className="blockquote-footer mt-3">
                Julie R. 25 ans, certifi&eacute;e en Solidity
              </figcaption>
            </figure>
          </div>
          <div className="testimony col-3 p-3 text-center">
            <figure>
              <blockquote className="blockquote">
                Vivamus eros ante, fringilla sit amet leo hendrerit, vestibulum
                consectetur velit. Aliquam quis molestie arcu
              </blockquote>
              <img src={profile2} />
              <figcaption className="blockquote-footer mt-3">
                Radjani M. 22 ans, certifi&eacute; en Solidity
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="topic-2">
        <div className="container py-5">
          <div className="row justify-left pb-3">
            Nullam dignissim ultricies odio sit amet molestie. In hac habitasse
            platea dictumst. Etiam nec ante ut arcu tincidunt ullamcorper.
            Quisque eget ex imperdiet ligula fermentum egestas nec gravida
            lorem. Nullam finibus sed nunc vel fringilla.
          </div>
          <div className="row text-end">
            Vivamus tempus eleifend lorem, sit amet porta nisl. Praesent
            condimentum, nisi a fermentum ultrices, turpis tortor euismod ante,
            sed elementum magna libero iaculis nunc. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
