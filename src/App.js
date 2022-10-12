import './App.css';
import PathFinder from './components/PathFinder';
import Nav from './components/Nav';
import Footer from './components/footer';
import Nodes from './components/Nodes';

function App() {
  return (
    <div className="App">
      <Nav />
      <Nodes />
      <PathFinder />
      <Footer />
    </div>
  );
}

export default App;
