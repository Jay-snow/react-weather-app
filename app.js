"use strict";

const e = React.createElement;

const api_url =
  "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=bc29f70f91ce3ca5a066b994763e3502";

class StartButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false, lat: 0, lon: 0, location: '', temp: 0, feels_like: 0
     };
  }

  getLongAndLat() {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  }

//   //callback func for navigator.getCurrentPosition
//   getLocation = async (pos) => {
//     console.log("begin geo");
//     //Get the coords from the navigator
//     const crd = pos.coords;

//     //Set the state. Round the lat and long, as I'm not sure if this API accepts long floats.
//     this.setState({ lat: Math.round(crd.latitude) });
//     this.setState({ lon: Math.round(crd.longitude) });

//     console.log(this.state.lat);
//   };

  async callAPI() {
    //Grabs the current location and stores it in state.
    //We need to wait until the coords have been grabbed before making the query.
    // await navigator.geolocation.getCurrentPosition(await this.getLocation);

    let position = await this.getLongAndLat()




    //Build the needed URL query
    let url_query = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=bc29f70f91ce3ca5a066b994763e3502`;

    //Make the axios call
    axios.get(url_query).then(
      (response) => {
        console.log(response)
        //Set the state for the app
        this.setState({location: response.data.name})
        this.setState({temp: response.data.main.temp})
        this.setState({feels_like: response.data.main.feels_like})



      },
      (error) => {
        console.log(error);
      }
    );
  }

  render() {
    if (this.state.liked) {
      return "You liked this.";
    }

    return (
      <div>
        {/* <button onClick={() => this.setState({ liked: true })}>Hi!</button> */}
        <button onClick={() => this.callAPI()}>Call API!</button>

        <p>{new Date().toLocaleString()}</p>
        <h2>{this.state.location}</h2>
        <h2>{this.state.temp} Degrees</h2>
        <h2>Feels like {this.state.feels_like}</h2>
        <h2>Cloudy</h2>
      </div>
    );

    // return e(
    //   'button',
    // //   { onClick: () => this.setState({ liked: true }) },
    //   { onClick: () => this.callAPI() },

    //   'Like'
    // );
  }
}

const domContainer = document.querySelector("#activate");

const root = ReactDOM.createRoot(domContainer);

root.render(e(StartButton));
