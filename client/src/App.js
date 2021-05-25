import React, {useState, useEffect} from "react";
import ReactMapGL, {Marker, Popup} from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import "./App.css";
import axios from "axios";
import {format} from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";


function App() {
  const myStorage = window.localStorage;
  const [currUser, setCurrUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [viewport, setViewport] = useState({
    width: "95vw",
    height: "95vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 4
  });
  const [showRegister, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);


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

  const handleSubmit = async (e) => {
    // To not refresh page on submit \\
    e.preventDefault();
    const newPin = {
      userName: currUser,
      title,
      description,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err)
    }
  };

  const handleLogout = () => {
    setCurrUser(null);
    myStorage.removeItem("user");
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
                  {Array(p.rating).fill(<Star className="rating-star"/>)}
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
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input onChange={(e) => setTitle(e.target.value)} placeholder="Enter Name"/>
              <label>Review</label>
              <textarea placeholder="Review this location" onChange={(e) => setDesc(e.target.value)}/>
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
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
      {currUser ? (<button className="button logout" onClick={handleLogout}>Logout</button>) : (<div className="buttons">
        <button className="button login" onClick={() => setShowLogin(true)} >Login</button>
        <button className="button register" onClick={() => setShowRegistration(true)} >Register</button>
      </div>)}
      {showRegister && <Register setShowRegistration={setShowRegistration}/>}
      {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrUser={setCurrUser} />}
    </ReactMapGL>
    </div>
  );
}

export default App;
