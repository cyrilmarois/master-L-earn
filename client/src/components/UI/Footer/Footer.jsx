import "./Footer.css";
import SubFooter from "./SubFooter/SubFooter";

const Footer = () => {
  return (
    <footer>
      <div className="container py-5 d-flex justify-content-evenly">
        <div className="col-3">
          <h6 className="mb-4">Apprendre</h6>
          <p>Parcours</p>
          <p>Trailmixes</p>
          <p>Modules</p>
          <p>Projets</p>
          <p>Trailhead Academy</p>
          <p>Parcours professionnel</p>
        </div>
        <div className="col-3">
          <h6 className="mb-4">Communaute</h6>
          <p>Trailblazer Community</p>
          <p>Evenements</p>
          <p>Quetes</p>
          <p>Be a Multiplier (BAM)</p>
          <p>Developpeurs Salesforce</p>
          <p>Administrateurs Salesforce</p>
          <p>Trailblazer Connect</p>
        </div>
        <div className="col-3">
          <h6 className="mb-4">Petits plus</h6>
          <p>Sales Enablmnent</p>
          <p>Recits clients</p>
          <p>Trail Tracker</p>
          <p>Galeries d'exemples</p>
          <p>Boutique Trailhead</p>
          <p>Aide Trailhead</p>
        </div>
      </div>
      <SubFooter />
    </footer>
  );
};

export default Footer;
