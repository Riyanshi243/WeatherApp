import React, {useState} from "react";
import logo from './logo.svg';
import axios from "axios";
import Loader from "react-loader-spinner";
import './App.css';

//

const DayArray = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const App = () => {
  const [cityName,setCityName] = useState("");
  const [current, setCurrent] = useState({});
  const [location, setlocation] = useState({});
  const [dayArray, setDayArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [curr, setCurr] = useState(false);

  const date = new Date();
  const day = date.getDay();
  const daysName = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const getweatherForecast = () => {
    if(!cityName){
       return;
    }
    setLoading(true);
    setCurr(false);
    setDayArray([]);
    setCurrent([]);
    const url = "http://api.weatherapi.com/v1/forecast.json?key=36497fdfe8694866925141606202810&days=6&q=" + cityName;
    axios.get(url).then((result) => {
      setLoading(false);
      setCurr(false);
      console.log("result", result.data);
      if(result.data){
        setCurrent(result.data.current);
        setlocation(result.data.location);
        const _forecast = result.data.forecast;
        const newArr = [];
        _forecast.forecastday.forEach((elem) => {
          const obj = {};
          const day = new Date(elem.date).getDay();
          obj.day = daysName[day];
          obj.max = elem.day.maxtemp_c;
          obj.min = elem.day.mintemp_c;
          obj.avg = elem.day.avgtemp_c;
          obj.maxf = elem.day.maxtemp_f;
          obj.minf = elem.day.mintemp_f;
          obj.avgf = elem.day.avgtemp_f;
          obj.date = elem.date;
          obj.humidity = elem.day.avghumidity;
          obj.cond = elem.day.condition.text;
          obj.cond_icon = "https:"+ elem.day.condition.icon;
          obj.sunrise= elem.astro.sunrise;
          obj.moonrise= elem.astro.moonrise;
          obj.sunset=elem.astro.sunset;
          obj.moonset=elem.astro.moonset;
          obj.moonphase=elem.astro.moon_phase;
          newArr.push(obj);
        });

        setDayArray(newArr);
        setCurr(true);
      }
    })
    .catch((error)=>{
      setLoading(false);
      setCurr(false);
      alert(error.message);
    });
  };
  
   return(
    
    <div className = "App" style={{backgroundImage:"url(background.gif)"}}>
      <div className = "Header">
      <img src="rain.png" style={{height:"65px", width:"60px",paddingLeft:"80px", paddingTop:"15px",paddingRight:"200px"}}/>
      Weather Forecast App 
        <div className="myname"> By Riyanshi Verma </div> 
      </div>
      
        <div className="SearchContainer">
            <input 
              type="text" 
              placeholder="Search City" 
              onChange={(e) => {
                setCityName(e.target.value);
              }}
              style={{ height:"30px", width:"200px" , marginRight:"20px" ,borderRadius:"5px" }}
            />
            <input type="button" value="Search" 
             onClick={() =>{getweatherForecast();}}
            style={{ height:"30px",width:"60px",borderRadius:"10px" }}/>
        </div>
        <div className="CityName">
          <h2>Searching weather updates of : {cityName}</h2>
        </div>
       {loading ? (
        <div className="Loader">
          <Loader type="ThreeDots" color="#FF0000" height={80} width={80} />
        </div>) : null}
        
        {curr? (<div className="Card2">
            <h2>Current temp is {current.temp_c} &#8451; / {current.temp_f} &#8457; </h2>
            <h2>{current.condition.text}
            <img src={"https:"+current.condition.icon} width="80" height="60" paddingLeft="200px"/>
            </h2>
            <h2>Region is {location.region}</h2>
            <h2>Country is {location.country}</h2>
            <h2>Current local date and time is<br></br> {location.localtime}</h2>
          </div>
        ):null}

         
        {dayArray.map((e) => {
          return(
            <div className = "Card">
             
              <h3>{e.date} </h3>
              <h3>{e.day}</h3>
              <div className="TempText">Min Temp: {e.min} &#8451; / {e.minf} &#8457;</div>
              <div className="TempText">Avg Temp: {e.avg } &#8451; / {e.avgf} &#8457;</div>
             <div className="TempText">Max Temp: {e.max} &#8451; / {e.maxf} &#8457;</div>
             <div className="TempText">Avg Humidity: {e.humidity} % </div>
            <div className="TempText">{e.cond} </div>
            <img src={e.cond_icon}  width="100" height="90"/>
            <div className="TempText">Sunrise: {e.sunrise} </div>
            <div className="TempText">Sunset: {e.sunset} </div>
            <div className="TempText">Moonrise: {e.moonrise} </div>
            <div className="TempText">Moonset: {e.moonset} </div>
            <div className="TempText">Moon Phase: {e.moonphase} </div>
            </div>
          );
        })}
    </div>
  );
};


export default App;