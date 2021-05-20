import React, {useState, useEffect} from "react";
import ReactMapGL, {Marker, Popup} from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import "./App.css";
import axios from "axios";
import {format} from "timeago.js";


function App() {
  const currUser = "Jaydee"
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
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

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({...viewport, latitude: lat, longitude: long})
  }

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat: lat, long: long
    });
  }

  return (
    <ReactMapGL transitionDuration="200" onDblClick = {handleAddClick}
      {...viewport}
      mapStyle= "mapbox://styles/ahmedjomer/ckop6c3cr22uh17p56r6n5xff"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}>
        {pins.map((p) => (
    <>
        <Marker latitude={p.latitude} longitude={p.longitude} offsetLeft={-20} offsetTop={-10}>
          <Room onClick={() => handleMarkerClick(p._id, p.lat, p.long)} style ={{fontSize:viewport.zoom * 7, color: p.userName === currUser ? "black" : "orange", cursor: "pointer"}}/>
        </Marker>
        {p._id === currentPlaceId && (
        <Popup
              latitude={p.latitude}
              longitude={p.longitude}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
              anchor="bottom" >
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
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
          )}
        </>
        ))}
        {newPlace && (
      <Popup
        latitude={newPlace.lat}
        longitude={newPlace.long}
        closeButton={true}
        closeOnClick={false}
        onClose={() => setNewPlace(null)}
        anchor="left" >
          <div>
            <form>
              <label>Title</label>
              <input placeholder="Enter Name"/>
              <label>Review</label>
              <textarea placeholder="Review this location"/>
              <label>Rating</label>
              <select>
                <option value ="1">1</option>
                <option value ="2">2</option>
                <option value ="3">3</option>
                <option value ="4">4</option>
                <option value ="5">5</option>
              </select>
              <button className="submitButtonPin" type="submit">Pin it!</button>
            </form>
          </div>
      </Popup>
        )}
    </ReactMapGL>
    
  );
}

export default App;
