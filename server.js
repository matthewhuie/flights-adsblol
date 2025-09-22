import got from 'got'

var output = {};
const ADSBLOL_URL = 'https://api.adsb.lol'
const data_aircraft = await got(ADSBLOL_URL + '/v2/closest/LAT/LNG/RADIUS').json();

if (data_aircraft.ac.length > 0 &&
  (data_aircraft.ac[0].type === 'adsb_icao') &&
  (data_aircraft.ac[0].baro_rate ?? data_aircraft.ac[0].geom_rate ?? 0) < 0 &&
  (data_aircraft.ac[0].nav_heading ?? data_aircraft.ac[0].track ?? 90) < 90) {
  
  output.flight = data_aircraft.ac[0].flight.trim();
  output.aircraft = data_aircraft.ac[0].t;

  const plane = {
    planes: [{
      callsign: data_aircraft.ac[0].flight.trim(),
      lat: data_aircraft.ac[0].lat,
      lng: data_aircraft.ac[0].lon
  }]};

  const data_plane = await got.post(ADSBLOL_URL + '/api/0/routeset', {
    json: plane
  }).json();

  output.origin = data_plane[0]._airports.at(-2).iata;
  output.destination = data_plane[0]._airports.at(-1).iata;
}

console.log(output);
