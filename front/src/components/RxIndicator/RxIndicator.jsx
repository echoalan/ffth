// RxIndicator.js
import React from "react";

const RxIndicator = ({ rx, status }) => {
  if (!rx) return <span className="rxText">RX: N/A</span>;

  const valor = parseFloat(rx);

  let clase = "rx-bueno";

  // si la ONU está offline → directamente rojo
  if (status !== "Online") {
    clase = "rx-offline";
  } else if (valor < -29 || valor > -19) {
    clase = "rx-malo";
  } else if (valor === -29 || valor === -19) {
    clase = "rx-regular";
  }

  return (
    <div className="rxWrapper">
      <span className={`rxDot ${clase}`}></span>
      <span className="rxText">{rx} dBm</span>
    </div>
  );
};

export default RxIndicator;
