import "./Home.css";
import profile1 from "../../../images/profile-1-2.jpg";
import profile2 from "../../../images/profile-2-2.jpg";

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
          remboursemement jusqu'a 50% de ce que vous l'avez payez !
        </div>
        <div className="bloc2 col-4 p-3 text-center">
          <i className="icon fa-solid fa-rocket"></i>
          <h3>Booster vos chances</h3>
          Vos competences nous tiennent a coeur mais encore plus aux recruteurs
          ! Les SBT que vous remporterez a chaque certification, seront la pour
          attester de vos acquis ! Ils seront directement lies a votre adresse
          de wallet.
        </div>
        <div className="bloc3 col-4 p-3 text-center">
          <i className="icon fa-solid fa-people-roof"></i>
          <h3>Integrez la communaute !</h3>
          Evaluez vos formations, prenez part a la vie de la plateforme grace a
          notre DAO ! Il sera egalement possible de soutenir Master & LEarn via
          divers plans de staking allant de 6 a 24 mois !
        </div>
      </section>
      <section className="topic-1 subHeader pt-3">
        <div className="container subHeader">
          <p>
            Master & LEarn est une plateforme qui tend a repondre aux besoins de
            reconversions des personnes. Curabitur non ipsum id tortor
            scelerisque luctus id a ante.
          </p>
          <p>
            Orci varius natoque penatibus et magnis dis parturient montes,
            nascetur ridiculus mus. Ut at interdum mi. Donec vitae urna risus.
            Morbi nec nibh commodo elit lobortis efficitur nec at augue. In
            dapibus, lorem at auctor elementum, nunc mauris malesuada lectus,
            condimentum auctor lacus est ut dui.
          </p>
          <p>
            Donec eget porttitor quam. Curabitur porttitor nulla justo, ac
            molestie risus tempus quis. Nullam congue tortor ligula, ut
            vulputate tellus elementum in. Sed vitae neque lorem.
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
              <figcaption class="blockquote-footer mt-3">
                Julie R. 25 ans, certifiee sur une formation en Solidity
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
              <figcaption class="blockquote-footer mt-3">
                Radjani M. 22 ans, certifie sur une formation en Solidity
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
      <section className="topic-2">
        <div className="container  subHeader pt-3 d-flex justify-content-around">
          Nullam dignissim ultricies odio sit amet molestie. In hac habitasse
          platea dictumst. Etiam nec ante ut arcu tincidunt ullamcorper. Quisque
          eget ex imperdiet ligula fermentum egestas nec gravida lorem. Nullam
          finibus sed nunc vel fringilla. Curabitur fermentum magna urna, vel
          semper erat finibus a. In vitae gravida mi, sed vulputate purus.
          Vivamus tempus eleifend lorem, sit amet porta nisl. Praesent
          condimentum, nisi a fermentum ultrices, turpis tortor euismod ante,
          sed elementum magna libero iaculis nunc. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit.
        </div>
      </section>
    </div>
  );
};

export default Home;
