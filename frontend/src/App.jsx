import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import DynamicGraph from './DynamicGraph';
function App() {
  return (
    <div>
      <Home/>
      <h1 style={{color: "#0b546e",textAlign:"center", fontSize:"50px",background:"#f9f9f9",height:"100px"}}>Graph For Researcher</h1>
      <DynamicGraph /> {/* Render the ConditionList component */}
    </div>
  );
}

export default App;
