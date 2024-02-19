import React, { useEffect, useState } from "react";

function GMaps({ onLocationSelect }) {
  const [marcador, setMarcador] = useState(null);

  useEffect(() => {
    initMap();

    return () => {};
  }, []);

  function initMap() {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 43.36994, lng: -8.39865 },
      zoom: 13,
    });

    map.addListener("click", function (event) {
      const latlng = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      obtenerCiudadYDireccion(latlng);

      if (marcador) {
        marcador.setPosition(latlng);
      } else {
        const nuevoMarcador = new window.google.maps.Marker({
          position: latlng,
          map: map,
        });
        setMarcador(nuevoMarcador);
      }
    });

    new window.google.maps.Marker({
      position: map.getCenter(),
      icon: "../images/location.svg",
      map: map,
    });
  }

  function obtenerCiudadYDireccion(latlng) {
    const geocoder = new window.google.maps.Geocoder();

    try {
      geocoder.geocode({ location: latlng }, function (results, status) {
        if (status === "OK") {
          if (results[0]) {
            const direccion = results[0].formatted_address;
            const ciudad = results[0].address_components.find((component) =>
              component.types.includes("locality")
            ).long_name;

            document.getElementById("ciudad").textContent = ciudad;
            document.getElementById("direccion").textContent = direccion;
            onLocationSelect(ciudad, direccion);
          } else {
            console.error(
              "No se encontraron resultados para las coordenadas proporcionadas."
            );
          }
        } else {
          console.error("Error al obtener la dirección:", status);
        }
      });
    } catch (error) {
      console.log("Error del mapa:", error);
    }
  }

  return (
    <div>
      <div
        id="map"
        style={{ height: "20rem", width: "50%", border: "dashed" }}
      ></div>
      <div style={{ display: "none" }} id="ciudad"></div>
      <div style={{ display: "none" }} id="direccion"></div>
    </div>
  );
}

export default GMaps;
