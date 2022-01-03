import React from 'react';
import logo from './logo.png';
import button from './button.png';
import './App.css';

const QUOTE = "We laugh at dogs getting excited when they hear a bark on TV, but if TV was a nonstop stream of unintelligible noises and then someone suddenly spoke to you in your language, you'd be pretty startled too."
const AUTHOR = "u/Biles"

const API_ENDPOINT = "https://www.reddit.com/r/Showerthoughts.json?limit=100";

// const thoughts = fetch(API_ENDPOINT)
//   .then(response => response.json())
//   .then(data => {
//     return data.data.children;
//   })
//   .catch(error => console.log(error));

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
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false)

  React.useEffect(() => {
    fetch(API_ENDPOINT)
      .then(response => response.json())
      .then(data => {
        console.log(data.data.children);
        setThoughts(shuffle(data.data.children));
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsError(true);
      })
  }, []);

  function handleButtonClick() {
    console.log("button pressed");
    setPostNum(postNum+1);
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
      <a className="quote" href={url}>{quote}</a>
    </div>
  )
}

const Button = ({ buttonHandler}) => {
  return (
    <img onClick={buttonHandler} src={button} className="btn" alt="next"/>
  )
}

export default App;
