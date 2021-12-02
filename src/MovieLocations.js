import React, {useCallback, useEffect, useState} from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { InfoWindow, Marker } from '@react-google-maps/api';
import {GMAP_API_KEY} from "./Config";
import * as moment from 'moment';
import {Typography} from "@mui/material";

const containerStyle = {
    width: '80%',
    height: '600px'
};

const center = {
    lat: 37.772,
    lng: -122.214
};

const divStyle = {
    background: `white`,
    border: `1px solid #ccc`,
    color: `#000`,
    padding: 15
}

function MovieLocation(movies) {
    const [locationMovie, setLocationMovie] = useState(null);

    useEffect(() => {
            const listener = e => {
                if (e.key === "Escape") {
                    setLocationMovie(null);
                }
            };
            window.addEventListener("keydown", listener);
            return () => {
                window.removeEventListener("keydown", listener);
            };
        },
        []);
    const locationMarks = () =>  {
        if(movies && movies.movieLocations.length){
            return movies.movieLocations.map(movieLocation => (
                <Marker  key={movieLocation.attributes.OBJECTID}
                                position={{lng: movieLocation.geometry.x, lat: movieLocation.geometry.y}}
                         onClick={() => {
                             setLocationMovie(movieLocation);
                         }}
                />
            ))
        }else return null;

    }

    return (
        <LoadScript
            googleMapsApiKey={GMAP_API_KEY}
        >
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={movies && movies.movieLocations.length? {lng: movies.movieLocations[0].geometry.x, lat: movies.movieLocations[0].geometry.y}:center}
                zoom={10}
            >
                {locationMarks()}
                {locationMovie &&
                <InfoWindow position={{lng: locationMovie.geometry.x, lat: locationMovie.geometry.y}}>
                    <div style={divStyle}>
                        <Typography sx={{ fontSize: 14 }} gutterBottom>
                            Title: {locationMovie.attributes.Title}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }}>
                            Shoot date: {moment(locationMovie.attributes.ShootDate).format('DD-MM-YYYY')}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }}>
                            Site: {locationMovie.attributes.Site}
                        </Typography>
                        <Typography sx={{ fontSize: 14 }}>
                            Address: {locationMovie.attributes.Address}
                        </Typography>
                    </div>
                </InfoWindow>
                }
            </GoogleMap>
        </LoadScript>
    )
}

export default React.memo(MovieLocation)
