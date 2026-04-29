"use client";
import "./Nav.scss";
import Svg from "../img/Svg";

const WAButton = () => {

  return (
    <div className="btn__wa">
      <a
        href={`https://wa.me/+529993314062`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ir a WhatsApp"
      >
        <Svg variant="WhatsApp" />
      </a>
    </div>
  );
};

export default WAButton;
