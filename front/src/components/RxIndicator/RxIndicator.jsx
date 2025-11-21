// RxIndicator.js
import './RxIndicador.css'

const RxIndicator = ({ rx, status }) => {
  if (!rx && rx !== 0) return <span className="rxText">RX: N/A</span>;

  const valor = parseFloat(rx);
  let clase = "rx-verde"; // default verde

  // 🔴 OFFLINE o muy malo (≤ -30)
  if (status !== "Online" || valor <= -30) {
    clase = "rx-rojo";
  } 
  // 🟠 Malo (-29, -28, -27) 
  else if (valor <= -27) {
    clase = "rx-naranja";
  } 
  // 🟢 Bueno (-26 a -19)
  else if (valor >= -26 && valor <= -19) {
    clase = "rx-verde";
  }

  return (
    <div className="rxWrapper">
      <span className={`rxDot ${clase}`}></span>
      <span className="rxText">{rx} dBm</span>
    </div>
  );
};



export default RxIndicator;
