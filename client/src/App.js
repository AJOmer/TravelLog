import React, {useState, useEffect} from "react";
import ReactMapGL, {Marker, Popup} from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import "./App.css";
import axios from "axios";


function App() {
  const [pins, setPins] = useState([]);
  const [viewport, setViewport] = useState({
    width: "95vw",
    height: "95vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 7
  });

  // fetch all pins/post
  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data) ; 
      } catch (err) {
        console.log(err)
      }
    };
    getPins();
  }, [])

  return (
    <ReactMapGL
      {...viewport}
      mapStyle= "mapbox://styles/ahmedjomer/ckop6c3cr22uh17p56r6n5xff"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}>
        {pins.map((p) => (
    <>
        <Marker latitude={p.latitude} longitude={p.longitude} offsetLeft={-20} offsetTop={-10}>
          <Room style ={{fontSize:viewport.zoom * 4, color: "black"}}/>
        </Marker>
        
        <Popup
              latitude={p.latitude}
              longitude={p.latitude}
              closeButton={true}
              closeOnClick={false}
              anchor="left" >
              <div className="card">
                <label>Place</label>
                <h4 className="place-name">{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.description}</p>
                <label>Rating</label>
                <div className="star-rating">
                  <Star className="rating-star"/>
                  <Star className="rating-star"/>
                  <Star className="rating-star"/>
                  <Star className="rating-star"/>
                  <Star className="rating-star"/>
                </div>
                <label>Information</label>
                <span className="username">Created by <b>{p.userName}</b></span>
                <span className="date">Created an hour ago</span>
              </div>
            </Popup>
        </>
        ))}
    </ReactMapGL>
    
  );
}

export default App;
