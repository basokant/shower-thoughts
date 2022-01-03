import React from 'react';
import logo from './logo.png';
import button from './button.png';
import './App.css';

const API_ENDPOINT = "https://www.reddit.com/r/Showerthoughts.json";

// Fisher-Yates shuffle algorithm to "shuffle" an array.
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function App() {

  const [postNum, setPostNum] = React.useState(0);
  const [thoughts, setThoughts] = React.useState([]);
  const [lastThought, setLastThought] = React.useState("");
  const [endOfPage, setEndOfPage] = React.useState(false);
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false)

  React.useEffect(() => {
    setIsLoading(true);
    setPostNum(0);
    const ENDPOINT = lastThought ? `${API_ENDPOINT}?after=${lastThought}` : API_ENDPOINT;
    console.log(ENDPOINT);
    fetch(ENDPOINT)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        console.log(data.data.children);
        console.log(data.data.after);
        setLastThought(data.data.after);
        setThoughts(shuffle(data.data.children));
        setIsLoading(false);
        setEndOfPage(false);
      })
      .catch(error => {
        console.log(error);
        setIsError(true);
      })
  }, []);

  React.useEffect(() => {
    if (endOfPage == true) {
      setIsLoading(true);
      setPostNum(0);
      const ENDPOINT = lastThought ? `${API_ENDPOINT}?after=${lastThought}` : API_ENDPOINT;
      console.log(ENDPOINT);
      fetch(ENDPOINT)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          console.log(data.data.children);
          console.log(data.data.after);
          setLastThought(data.data.after);
          setThoughts(shuffle(data.data.children));
          setIsLoading(false);
          setEndOfPage(false);
        })
        .catch(error => {
          console.log(error);
          setIsError(true);
        })
    }
  }, [endOfPage]);

  function handleButtonClick() {
    console.log("button pressed");
    if ((postNum+1) < thoughts.length) {
      setPostNum(postNum+1);
    } else {
      setEndOfPage(true);
    }
  }
  
  return (
    <div className="App">
      <div className="App-header">
        <header className="header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        {isLoading || isError ? (
          <div className="lds-ellipsis content"><div></div><div></div><div></div><div></div></div>
          // <div>Loading</div>
        ) : (
          <div className="content">
            <Card quote={thoughts[postNum].data.title} url={thoughts[postNum].data.url}></Card>
            <div className="author">
              <p>{`~ u/${thoughts[postNum].data.author}`}</p>
            </div>
          </div>
        )}

        <footer className="footer">
          <Button buttonHandler={handleButtonClick}></Button>
        </footer>
      </div>
    </div>
  );
}

const Card = ({ quote, url }) => {
  return (
    <div className="card">
      <a className="quote" href={url} target="_blank">{quote}</a>
    </div>
  )
}

const Button = ({ buttonHandler}) => {
  return (
    <img onClick={buttonHandler} src={button} className="btn" alt="next"/>
  )
}

export default App;
