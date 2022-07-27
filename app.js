"use strict";

const e = React.createElement;

const api_url =
  "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=bc29f70f91ce3ca5a066b994763e3502";

class StartButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
      lat: 0,
      lon: 0,
      location: "",
      temp: 0,
      feels_like: 0,
      clouds: 0,
      humidity: 0,
      wind_speed: 0,
      wind_degree: 0,
      weather_main: "",
      weather_description: "",
      sunrise: 0,
      sunset: 0,
      visibility: 0,
    };
  }

  //Fetchs long and lat from navigator. Set inside a promise so we can make it asynchronous later.
  getLongAndLat() {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  }
  setCallState(response) {
    console.log(response);
    //Set the state for the app
    this.setState({ location: response.data.name });
    this.setState({ temp: Math.round(response.data.main.temp) });
    this.setState({
      feels_like: Math.round(response.data.main.feels_like),
    });
    this.setState({ clouds: response.data.clouds.all });

    this.setState({ wind_speed: Math.round(response.data.wind.speed) });
    this.setState({ wind_degree: response.data.wind.deg });

    this.setState({ weather_main: response.data.weather[0].main });
    this.setState({
      weather_description: response.data.weather[0].description,
    });

    this.setState({ sunrise: this.convertTime(response.data.sys.sunrise) });
    this.setState({ sunset: this.convertTime(response.data.sys.sunset) });

    this.setState({ visibility: this.convertKMtoMiles(response.data.visibility) });
  }

  async callAPI() {
    const user_latitude = localStorage.getItem("latitude");
    const user_longitude = localStorage.getItem("longitude");

    //Attempt to grab the API if it's been saved.

    if (user_latitude && user_longitude) {
      //Build the needed URL query
      let url_query = `https://api.openweathermap.org/data/2.5/weather?lat=${user_latitude}&lon=${user_longitude}&units=imperial&appid=bc29f70f91ce3ca5a066b994763e3502`;

      //Make the axios call
      axios.get(url_query).then(
        (response) => {
          this.setCallState(response);
        },
        (error) => {
          console.log(error);
        }
      );
    }

    //Grabs the current location and stores it in state.
    //We need to wait until the coords have been grabbed before making the query.
    // await navigator.geolocation.getCurrentPosition(await this.getLocation);

    let position = await this.getLongAndLat();

    //Save local storage

    localStorage.setItem("latitude", position.coords.latitude);
    localStorage.setItem("longitude", position.coords.longitude);

    //Build the needed URL query
    let url_query = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=bc29f70f91ce3ca5a066b994763e3502`;

    //Make the axios call
    axios.get(url_query).then(
      (response) => {
        this.setCallState(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  convertKMtoMiles(kilometers){
    
    return (kilometers / 1000)
  }

  convertTime(time) {
    let converted_time = new Date(time * 1000);
    return converted_time.toLocaleTimeString("en-us", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  componentDidMount() {
    console.log("mounted!");
    //Call API needs to store lat and long in localstorage
    //Use local storage if its there
    this.callAPI();
  }

  cloudStatusIcon() {
    if (this.state.clouds > 75) {
      return <span className="material-symbols-outlined md-60">cloud</span>;
    } else {
      return (
        <span className="material-symbols-outlined md-60 md-light">sunny</span>
      );
    }
  }

  cloudStatusText() {
    if (this.state.clouds > 75) {
      return <span>Cloudy</span>;
    } else {
      return <span>Sunny</span>;
    }
  }

  render() {
    if (this.state.liked) {
      return "You liked this.";
    }

    return (
      <div className="fadeInUp">
        {/* Location Icon and Area */}
        <h2 className="text-icon-wrapper">
          <span className="material-symbols-outlined">location_on</span>
          {this.state.location}
        </h2>
        {/* Time and Date */}
        <p className="text-center" style={{ marginBottom: 0 }}>
          <span style={{ marginRight: "10px" }}>
            {new Date().toLocaleString("en-us", {
              weekday: "short",
              month: "long",
              day: "numeric",
            })}
          </span>

          <span>
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </p>
        {/* Actual Temperature */}
        <p style={{ margin: 0 }} className="text-icon-wrapper">
          {this.cloudStatusIcon()}
          <span id="temperature">{this.state.temp}</span>{" "}
          <span id="degree">
            <sup>&#176;</sup>
          </span>
        </p>
        {/* Weather Description */}
        <h2 className="text-center" style={{ textTransform: "capitalize", margin: 0 }}>
          {this.state.weather_description}
        </h2>
        {/* todo Need to make cloudy status conditional */}
        <section style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Feels Like: {this.state.feels_like}</p>
          <p>Wind: {this.state.wind_speed}</p>
          <p>Visibility: : {this.state.visibility}</p>
        </section>
        <hr></hr>
        <section style={{justifyContent: 'left'}}>
          <div>
            <h4>Sunrise:</h4>
            <div className="sun-icon-wrapper ">
              <span className="material-symbols-outlined md-48 mr-1">brightness_5</span>{" "}
              <span style={{fontSize: '1.75rem'}}>{this.state.sunrise}</span>
            </div>
          </div>
          <div>
            <h4>Sunset</h4>
            <div className="sun-icon-wrapper">
              <span className="material-symbols-outlined md-48 mr-1">wb_twilight</span>{" "}
              <span style={{fontSize: '1.75rem'}}>{this.state.sunset}</span>
            </div>
            
          </div>
        </section>
      </div>
    );
  }
}

const domContainer = document.querySelector("#activate");

const root = ReactDOM.createRoot(domContainer);

root.render(e(StartButton));
