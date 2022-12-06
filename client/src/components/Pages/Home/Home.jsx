import "./Home.css";

const Home = () => {
  return (
    <div id="home">
      <div className="header d-flex justify-content-center align-items-center">
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1 className="slogan display-4">Master LEarn</h1>
            <p className="lead">Apprendre n'aura jamais autant un plaisir !</p>
          </div>
        </div>
      </div>
      <section className="container subHeader pt-3 d-flex justify-content-around">
        <div className="bloc1 col-4 p-3 text-center">
          <i className="icon fa-solid fa-graduation-cap"></i>
          <h3>Apprenez tout en gagnant !</h3>
          Le prix de la formation ne doit plus etre un barrage. Montrez votre
          determination au travers de formations de qualites et recevez le
          remboursemement jusqu'a 50% de ce que vous l'avez payez ! A travers
          des formations de qualite
        </div>
        <div className="bloc2 col-4 p-3 text-center">
          <i className="icon fa-solid fa-rocket"></i>
          <h3>Booster vos chances</h3>
          Vos competences nous tiennes a coeur mais encore plus aux recruteurs !
          Les SBT que vous remporterez a chaque certification, seront la pour
          attester de vos acquis ! Ils seront directement lies a votre adresse
          de wallet.
        </div>
        <div className="bloc3 col-4 p-3 text-center">
          <i className="icon fa-solid fa-people-roof"></i>
          <h3>Integrez la communaute !</h3>
          Notre DAO vous permet de prendre part a la vie de la plateforme !
          Evaluez vos formations, contribuez a des propositions. Il sera
          egalement possible de soutenir Master & LEarn via le staking. Sur des
          plans allant de 6 a 24 mois !
        </div>
      </section>
      <section className="topic subHeader pt-3 d-flex justify-content-around">
        Master & LEarn est une plateforme qui tend a repondre aux besoins de
        reconversions des personnes. Entreprendre un nouveau balbla
      </section>
    </div>
  );
};

export default Home;
