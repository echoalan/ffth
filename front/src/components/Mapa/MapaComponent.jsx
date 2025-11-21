import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import createNodo from '../../services/nodos/createNodos';
import URL_API from '../../services/API';

import iconOLT from '../../assets/images/data-center.png';
import iconBotella from '../../assets/images/botella.png';
import iconCaja from '../../assets/images/caja.png';
import iconCaja8 from '../../assets/images/caja8.png';
import antena from "../../assets/images/antena.png";
import ModalSplitter from '../ModalSplitter/ModalSplitter';


const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    }
  });
  return null;
};

const tiles = [
  {
    nombre: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    preview: 'https://a.tile.openstreetmap.org/10/511/385.png'
  },
  {
    nombre: 'OpenStreetMap HOT',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    preview: 'https://a.tile.openstreetmap.fr/hot/10/511/385.png'
  },
  {
    nombre: 'Carto Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    preview: 'https://a.basemaps.cartocdn.com/light_all/10/511/385.png'
  },
  {
    nombre: 'Carto Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    preview: 'https://a.basemaps.cartocdn.com/dark_all/10/511/385.png'
  },
  {
    nombre: 'Esri Satelital',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/10/385/511'
  },
  {
    nombre: 'Esri Topográfico',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/10/385/511'
  },
  {
    nombre: 'Esri Callejero',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/10/385/511'
  },
  {
    nombre: 'Esri Gray (fondo claro)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/10/385/511'
  },
  {
    nombre: 'OpenTopoMap',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    preview: 'https://a.tile.opentopomap.org/10/511/385.png'
  },
  {
    nombre: 'Wikimedia Map',
    url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
    preview: 'https://maps.wikimedia.org/osm-intl/10/511/385.png'
  }
];

const MapaComponent = () => {
  const [modoCreacion, setModoCreacion] = useState(false);
  const [nodos, setNodos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoNodoData, setNuevoNodoData] = useState({ lat: null, lng: null });
  const [formNodo, setFormNodo] = useState({ tipo: '', nombre: '' });

  const [modoConexion, setModoConexion] = useState(false);
  const [nodoOrigen, setNodoOrigen] = useState(null);
  const [nodoDestino, setNodoDestino] = useState(null);
  const [modalConexionVisible, setModalConexionVisible] = useState(false);
  const [tipoConexion, setTipoConexion] = useState('');

  const [dibujandoRuta, setDibujandoRuta] = useState(false);
  const [rutaTemporal, setRutaTemporal] = useState([]);

  const [popupConexion, setPopupConexion] = useState(null);
  const [posicionPopup, setPosicionPopup] = useState(null);

  const [tileSeleccionado, setTileSeleccionado] = useState(tiles[0].url);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [zoomLevel, setZoomLevel] = useState(15.5);

  const [nodosResaltados, setNodosResaltados] = useState([]);

  const [rutasResaltadas, setRutasResaltadas] = useState([]);

  const [modalAgregarClienteVisible, setModalAgregarClienteVisible] = useState(false);

  /*esto es para intentar mejorar el modal al abrir cada caja*/
  const [modalSplitter, setModalSplitter] = useState(false);
  const [nodoSelected, setNodoSelected] = useState(null);

  /*------------------------------------------*/

  const iconosPersonalizados = {
    OLT: L.icon({
      iconUrl: iconOLT,
      iconSize: [50, 50],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    }),
    Botella: L.icon({
      iconUrl: iconBotella,
      iconSize: [50, 50],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    }),
    Splitter1x4: L.icon({
      iconUrl: iconCaja,
      iconSize: [50, 50],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    }),
    Splitter1x8: L.icon({
      iconUrl: iconCaja8,
      iconSize: [50, 50],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    }),
    Antena: L.icon({
      iconUrl: antena,
      iconSize: [100, 100],
      iconAnchor: [100, 100],
      popupAnchor: [0, -32]
    }),
  };

  const defaultIcon = L.icon({
    iconUrl: '/icons/default.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const iconCaja8Resaltada = L.icon({
    iconUrl: iconCaja8,
    iconSize: [50, 50],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: 'icono-resaltado'
  });

  const ZoomHandler = ({ setZoomLevel }) => {
    useMapEvents({
      zoomend: (e) => {
        const map = e.target;
        setZoomLevel(map.getZoom());
      }
    });
    return null;
  };

  const getIconSize = (zoom) => {
    const baseSize = 18;
    let newSize;

    if (zoom < 16) {
      newSize = baseSize + (zoom - 20);
    } else if (zoom === 16) {
      newSize = baseSize + (zoom - 15) * 4;
    } else if (zoom >= 17) {
      newSize = baseSize + (zoom - 15) * 7;
    }

    // Limitar tamaño mínimo
    if (newSize < 5) newSize = 5;

    return [newSize, newSize];
  };


  const getIconAnchor = (size) => {
    return [size[0] / 3, size[1] - 10]; // centro abajo
  };

  useEffect(() => {
    const fetchNodos = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${URL_API}/nodos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Error al cargar nodos');
        const data = await res.json();
        setNodos(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNodos();
  }, []);

  const handleMapClick = (latlng) => {
    if (modoCreacion) {
      setNuevoNodoData(latlng);
      setFormNodo({ tipo: '', nombre: '' });
      setModalVisible(true); // <-- ESTA LÍNEA ES LA CLAVE
    } else if (dibujandoRuta && nodoOrigen && !nodoDestino) {
      console.log('Agregando punto a rutaTemporal:', latlng);
      setRutaTemporal(prev => [...prev, { lat: latlng.lat, lng: latlng.lng }]);
    }
  };

  const confirmarCreacionNodo = async () => {
    try {
      const nuevoNodo = await createNodo({
        tipo: formNodo.tipo,
        nombre: formNodo.nombre || null,
        lat: nuevoNodoData.lat,
        lng: nuevoNodoData.lng,
        propiedades: {}
      });

      setNodos(prev => [...prev, { ...nuevoNodo, conexiones_origen: [] }]);
      setModalVisible(false);
      setModoCreacion(false);
    } catch (err) {
      alert("Error al crear nodo: " + err.message);
    }
  };

  const getConexionesRutas = () => {
    let rutas = [];
    nodos.forEach(nodo => {
      if (Array.isArray(nodo.conexiones_origen)) {
        nodo.conexiones_origen.forEach(conexion => {
          if (conexion.ruta && conexion.ruta.length > 0) {
            const rutaCoords = conexion.ruta.map(p => [p.lat, p.lng]);
            rutas.push({
              id: conexion.id,
              coords: rutaCoords,
              tipo: conexion.tipo_conexion,
            });
          }
        });
      }
    });
    return rutas;
  };

  const rutas = getConexionesRutas();

  return (
    <div className='Mapcontainer'>
      


      <MapContainer center={[-36.640, -57.790]} zoom={15.5} style={{ width: '100%', height: '100%' }}>
        <ZoomHandler setZoomLevel={setZoomLevel} />
        <TileLayer
          url={tileSeleccionado}
        />

        {(modoCreacion || modoConexion || dibujandoRuta) && (
          <ClickHandler onClick={handleMapClick} />
        )}

        {/* Dibujo las rutas existentes ANTES que los nodos para que no tapen las líneas */}
        {rutas.map(ruta => {
          // Verifico si la ruta está resaltada
          const esResaltada = rutasResaltadas.includes(ruta.id);

          // Colores y grosor base para rutas
          let color = 'gray';
          let weight = 3;

          if (esResaltada) {
            color = 'red';      // Color para rutas resaltadas
            weight = 6;         // Más grueso para resaltar
          } else {
            // Si no está resaltada, uso tus colores según tipo
            if (ruta.tipo === 'FibraTroncal') { color = 'violet'; weight = 5; }
            else if (ruta.tipo === 'FIBRA PON 3') { color = '#ff9900'; weight = 4; }
            else if (ruta.tipo === 'FIBRA PON 4') { color = '#33cc33'; weight = 4; }
            else if (ruta.tipo === 'FIBRA PON 5') { color = '#3399ff'; weight = 4; }
            else if (ruta.tipo === 'FIBRA PON 6') { color = '#ff33cc'; weight = 4; }
            else if (ruta.tipo === 'Fibra') { color = '#000'; weight = 2; }
          }

          return (
            <Polyline
              key={ruta.id}
              positions={ruta.coords}
              color={color}
              weight={weight}
              eventHandlers={{
                click: (e) => {
                  setPopupConexion(ruta);
                  setPosicionPopup(e.latlng);
                }
              }}
            />
          );
        })}

        {/* Polylines temporales para dibujar la ruta */}
        {dibujandoRuta && nodoOrigen && (
          <Polyline
            positions={
              nodoDestino
                ? [
                  [nodoOrigen.lat, nodoOrigen.lng],
                  ...rutaTemporal.map(p => [p.lat, p.lng]),
                  [nodoDestino.lat, nodoDestino.lng],
                ]
                : [
                  [nodoOrigen.lat, nodoOrigen.lng],
                  ...rutaTemporal.map(p => [p.lat, p.lng]),
                ]
            }
            color="black"
            dashArray="5,5"
            weight={2}
          />
        )}

        {/* Ahora los nodos, para que estén encima de las líneas */}
        {nodos.map(nodo => (
          <Marker
            key={nodo.id}
            position={[nodo.lat, nodo.lng]}
            icon={
              nodosResaltados.includes(nodo.id) && nodo.tipo === 'Splitter1x8'
                ? iconCaja8Resaltada
                : L.icon({
                  iconUrl: iconosPersonalizados[nodo.tipo]?.options.iconUrl || '/icons/default.png',
                  iconSize: getIconSize(zoomLevel),
                  iconAnchor: getIconAnchor(getIconSize(zoomLevel)),
                  popupAnchor: [0, -getIconSize(zoomLevel)[1] / 2],
                })
            }
            eventHandlers={{
              click: () => {
                console.log('Nodo clickeado:', nodo);

                setNodoSelected(nodo); // Guardar el nodo seleccionado

                setModalSplitter(true)

                if (nodo.tipo === 'Splitter1x4') {
                  // Obtener IDs de cajas 1x8 conectadas
                  const cajas8Conectadas = nodo.conexiones_origen
                    ?.filter(con => con.nodo_destino?.tipo === 'Splitter1x8')
                    .map(con => con.nodo_destino.id) || [];

                  setNodosResaltados(cajas8Conectadas);

                  // Obtener rutas (conexiones) que conectan a esas cajas resaltadas
                  const rutasQueResaltan = nodo.conexiones_origen
                    .filter(con => con.nodo_destino && cajas8Conectadas.includes(con.nodo_destino.id))
                    .map(con => con.id);

                  setRutasResaltadas(rutasQueResaltan);

                } else {
                  setNodosResaltados([]);
                  setRutasResaltadas([]);
                }

                if (modoConexion) {
                  if (!nodoOrigen) {
                    setNodoOrigen(nodo);
                    setRutaTemporal([]);
                  } else if (!nodoDestino && nodo.id !== nodoOrigen.id) {
                    setNodoDestino(nodo);
                    setModalConexionVisible(true);
                  }
                }

                if (dibujandoRuta && nodoOrigen && !nodoDestino) {
                  if (nodo.id !== nodoOrigen.id) {
                    setRutaTemporal(prev => [...prev, { lat: nodo.lat, lng: nodo.lng }]);
                  }
                }
              },
              popupclose: () => {
                setNodosResaltados([]);
              }
            }}

          >
          </Marker>
        ))}

        {popupConexion && posicionPopup && (
          <Popup position={posicionPopup} onClose={() => {
            setPopupConexion(null);
          }}>
            <div>
              <strong>Conexión</strong><br />
              {popupConexion.tipo}<br />
              {console.log('popupConexion:', popupConexion)}
            </div>
          </Popup>
        )}

      </MapContainer>


      {modalSplitter && (
        <div className="modalAgregarCliente">
          <ModalSplitter onClose={() => { setModalSplitter(false); setNodosResaltados([]); setNodoSelected(null); }} nodo={nodoSelected} />
        </div>
      )}

      {modalVisible && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'start', alignItems: 'center',
          zIndex: 2000
        }}>
          <div className='containerTipoNodoModal'>
            <h3 className='tipoNodoTitle'>Nuevo Nodo</h3>
            <div style={{ marginBottom: 10 }}>
              <select
                value={formNodo.tipo}
                onChange={(e) => setFormNodo({ ...formNodo, tipo: e.target.value })}
                className='selectTipoNodo'
              >
                <option className='option' value="">Seleccioná un tipo de nodo</option>
                <option className='option' value="OLT">OLT</option>
                <option className='option' value="Antena">Antena</option>
                <option className='option' value="Botella">Botella</option>
                <option className='option' value="Splitter1x4">Splitter 1x4</option>
                <option className='option' value="Splitter1x8">Splitter 1x8</option>
                <option className='option' value="Cliente">Cliente</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                className='cancelarCaja'
                onClick={() => { setModalVisible(false); setModoCreacion(false); }}>Cancelar</button>
              <button
                onClick={confirmarCreacionNodo}
                className='nuevaCaja'
              >
                Crear Nodo
              </button>
            </div>
          </div>
        </div>
      )}



      {modalConexionVisible && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 2000
        }}>
          <div className='containerTipoNodoModal modalConexion'>
            <h3 style={{ fontWeight: 500, textAlign: 'center' }}>Conectar Nodos</h3>
            <div style={{ marginBottom: 10 }}>
              <select
                value={tipoConexion}
                onChange={(e) => setTipoConexion(e.target.value)}
                className='selectTipoNodo'
              >
                <option value="">Seleccioná un tipo</option>
                <option value="FibraTroncal">Fibra Troncal</option>
                <option value="FIBRA PON 3">Fibra PON 3</option>
                <option value="FIBRA PON 4">Fibra PON 4</option>
                <option value="FIBRA PON 5">Fibra PON 5</option>
                <option value="FIBRA PON 6">Fibra PON 6</option>
                <option value="Fibra">Fibra</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className='cancelarCaja' onClick={() => {
                setModalConexionVisible(false);
                setNodoOrigen(null);
                setNodoDestino(null);
                setModoConexion(false);
                setDibujandoRuta(false);
                setRutaTemporal([]);

              }}>Cancelar</button>
              <button
                className='nuevaCaja'
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`${URL_API}/conexiones`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        nodo_origen_id: nodoOrigen.id,
                        nodo_destino_id: nodoDestino.id,
                        tipo_conexion: tipoConexion,
                        numero_fibra: null,
                        ruta: [
                          { lat: nodoOrigen.lat, lng: nodoOrigen.lng },
                          ...rutaTemporal,
                          { lat: nodoDestino.lat, lng: nodoDestino.lng }
                        ],
                        propiedades: {}
                      })
                    });
                    console.log('rutaTemporal:', rutaTemporal);
                    console.log('Respuesta de crear conexión:', res);
                    if (!res.ok) throw new Error('Error al crear conexión');

                    const nuevaConexion = await res.json();

                    setNodos(prev => prev.map(n =>
                      n.id === nodoOrigen.id
                        ? {
                          ...n,
                          conexiones_origen: [...(n.conexiones_origen || []), nuevaConexion]
                        }
                        : n
                    ));

                    setModalConexionVisible(false);
                    setNodoOrigen(null);
                    setNodoDestino(null);
                    setModoConexion(false);
                    setTipoConexion('');
                    setDibujandoRuta(false);
                    setRutaTemporal([]);
                  } catch (err) {
                    alert("Error: " + err.message);
                  }
                }}
                style={{ backgroundColor: '#4caf50', color: 'white', padding: '5px 12px', border: 'none', borderRadius: 4 }}
              >
                Confirmar
              </button>
            </div>
          </div>

        </div>
      )}


      {/* Popup con información del nodo <Popup onClose={() => { ; }}>
              <div className='popupContent' style={{ minWidth: '200px' }}>
                <h3 className='tipoNodoTitlePopup'>{nodo.tipo}</h3>

                {nodo.tipo === 'Splitter1x4' && (
                  <div className='casperData'>
                    <h4 className='casperDataTitle'>Cajas NAP 1x8 conectadas:</h4>
                    <p className='casperDataValue'>
                      {nodo.conexiones_origen?.filter(con => con.nodo_destino?.tipo === 'Splitter1x8').length || 0}
                    </p>
                  </div>
                )}

                {nodo.tipo === 'Splitter1x8' && (
                  <div className='casperFormAdddClient'>
                    <h4>Clientes conectadoss:</h4>

                    <div className="modalAgregarCliente">
                      <AgregarCliente nodo={nodo} setModalAgregarClienteVisible={setModalAgregarClienteVisible} />
                    </div>
                  </div>
                )}
              </div>
            </Popup>*/}


    </div>
  );
};

export default MapaComponent;
