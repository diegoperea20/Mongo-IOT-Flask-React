import React, { useEffect, useState,useRef } from 'react';
import "../show.css";

import { Chart } from 'chart.js/auto';




// Conection to backend flask
const API_URL = import.meta.env.VITE_REACT_APP_API;

function Show() {
    const [code, setCode] = useState("");
    const [user, setUser] = useState('');
    const [id, setId] = useState('');
    const [token, setToken] = useState('');
    const [node, setNode] = useState([]);
    //table pretty
     const [startIndex, setStartIndex] = useState(0); // Declare startIndex here


  //graficoooo
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

    useEffect(() => {
        const storedCode = localStorage.getItem('code');
        const storedUser = localStorage.getItem('user');
        const storedId = localStorage.getItem('id');
        const storedToken = localStorage.getItem('token');
    
        if (!storedUser && !storedId) {
          // Si no se encuentra el nombre de usuario en el almacenamiento local, redirigir al inicio de sesión
          window.location.replace('/');
        } else {
          // Si se encuentra el nombre de usuario, establecer el estado del usuario
          setUser(storedUser);
          setId(storedId);
          setCode(storedCode);
        }
    
     
      }, []);

    const getNode = async (code) => {
    const response = await fetch(`${API_URL}/tablecode/${code}`);
    const data = await response.json();
    setNode(data);
    };



    useEffect(() => {
    getNode(code);
    
    },  );

    //graph

    useEffect(() => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
  
        if (chartRef.current) {
          chartRef.current.destroy();
        }
  
        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [],
          },
          options: {},
        });
      }
    }, []);
  
    useEffect(() => {
      if (node.length > 0 && chartRef.current) {

        const temperatureData = node.map((parameter) => parseFloat(parameter.temperature)).filter(value => !isNaN(value));
        const humidityData = node.map((parameter) => parseFloat(parameter.humidity)).filter(value => !isNaN(value));
  
        const labels = node.map((parameter) => parameter.id);
        const dataFirst = {
          label: 'Temperature °C',
          data: temperatureData,
          lineTension: 0,
          fill: false,
          borderColor: 'red',
        };
  
        const dataSecond = {
          label: 'Humidity',
          data: humidityData,
          lineTension: 0,
          fill: false,
          borderColor: 'blue',
        };
  
        const speedData = {
          labels: labels,
          datasets: [dataFirst, dataSecond],
        };
  
        const chartOptions = {
          animation: {
            duration: 0, // Desactivar la animación
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 80,
              fontColor: 'black',
            },
          },
        };
  
        chartRef.current.data = speedData;
        chartRef.current.options = chartOptions;
        chartRef.current.update();
      }
    }, [node]);
    
    
    const home=() => {
      window.location.href = '/home';
    } 

    const nodes_page=() => {
      window.location.href = '/home/task';
    } 

    //table with style and pretty
   const handleClickNext = () => {
    setStartIndex(startIndex + 5);
  };

  const handleClickPrevious = () => {
    setStartIndex(startIndex - 5);
  };

  const visibleData = node.slice(startIndex, startIndex + 5);
  //---------------------------

  return (
    <div className="darkTheme">
      <h1>Show {code}</h1>
      <button onClick={home}>Home</button>
      <button onClick={nodes_page}>Back</button>
      <div className='table-container'>
     <table>
          <thead>
            <tr>
              <th>Temperature °C</th>
              <th>Humidity</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((parameter) => (
              <tr key={parameter.id}>
                <td className="justified">{parameter.temperature}</td>
                <td className="justified">{parameter.humidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      <div>
        <button
            onClick={handleClickPrevious}
            disabled={startIndex === 0}
            className="small-button"
          >
            Anterior
          </button>
          <button
            onClick={handleClickNext}
            disabled={startIndex + 5 >= node.length}
            className="small-button"
          >
            Siguiente
          </button>
      </div>
    </div>
      <div>
      <canvas ref={canvasRef} id="chartCanvas"style={{ width: '100%', height: '200px' }}></canvas>

      </div>
    </div>
  );
}
export default Show