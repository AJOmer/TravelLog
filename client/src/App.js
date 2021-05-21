import React, {useState, useEffect} from "react";
import ReactMapGL, {Marker, Popup} from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import "./App.css";
import axios from "axios";
import {format} from "timeago.js";


function App() {
  const currUser = "Jaydee";
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [viewport, setViewport] = useState({
    width: "95vw",
    height: "95vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 4
  });

  // fetch all pins/post
  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
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
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude, long: longitude,
    });
  }

  return (
    <div style ={{ height: "100vh", width: "100%"}}>
    <ReactMapGL transitionDuration="200" 
      {...viewport}
      mapStyle= "mapbox://styles/ahmedjomer/ckop6c3cr22uh17p56r6n5xff"
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      width="100%" height="100%"
      onViewportChange={viewport => setViewport(viewport)}
      onDblClick = {currUser && handleAddClick}>
        {pins.map((p) => (
    <>
        <Marker latitude={p.lat} longitude={p.long} offsetLeft={-3.5 * viewport.zoom} offsetTop={-7 * viewport.zoom}>
          <Room onClick={() => handleMarkerClick(p._id, p.lat, p.long)} style ={{fontSize:viewport.zoom * 11, color: p.userName === currUser ? "black" : "orange", cursor: "pointer"}}/>
        </Marker>
        {p._id === currentPlaceId && (
        <Popup
              key={p._id}
              latitude={p.lat}
              longitude={p.long}
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
    </div>
  );
}

export default App;
