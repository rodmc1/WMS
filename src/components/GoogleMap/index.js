import React from 'react';
import MapStyle from 'config/map';

function GoogleMap(props) {

  const mapRef = React.createRef();
  const [googleMap, setGoogleMap] = React.useState(null);
  
  const options = {
    center: { lat: 14.559523, lng: 121.019534 },
    zoom: 18,
    mapTypeControl: false,
    draggable: true,
    scrollwheel: true,
    zoomControl: false,
    streetViewControl: false,
    panControl: false,
    scaleControl: true,
    overviewMapControl: false,
    fullscreenControl: true,
    rotateControl: false,
    styles: MapStyle
  }

  React.useEffect(() => {
    setGoogleMap(new window.google.maps.Map(mapRef.current, options));
  }, [])

  return (
    <div ref={mapRef} style={{ width: props.width, height: props.height }}>
      {props.children}
    </div>
  )
}

export default GoogleMap;