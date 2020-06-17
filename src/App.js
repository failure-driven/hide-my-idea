import React, { useState } from "react";
import "./App.css";

function App() {
  const [term, setTerm] = useState("");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [foundIdeas, setFoundIdeas] = useState([]);
  const [ideas, setIdeas] = useState([
    {
      id: 0,
      name: "demo name",
      tagline: "demo tagline",
    },
  ]);
  const fetchIdeas = (event) => {
    setTerm(event.target.value);
    // freely available API and key from
    // https://github.com/producthunt/producthunt-api/wiki/Product-Hunt-APIs
    fetch(
      `https://0h4smabbsg-dsn.algolia.net/1/indexes/Post_production?query=${event.target.value}`,
      {
        method: "GET",
        headers: {
          "X-Algolia-API-Key": "9670d2d619b9d07859448d7628eea5f3",
          "X-Algolia-Application-Id": "0H4SMABBSG",
          "Content-type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response;
        }
        return response.json().then((error) => {
          // this.setState({ error });
          throw new Error(`Request rejected with status ${response.status}`);
        });
      })
      .then((response) =>
        response.json().then((data) => {
          const nameAndTagline = data.hits.map(({ name, tagline }) => {
            return {
              name,
              tagline,
            };
          });

          setFoundIdeas(nameAndTagline);
        })
      );
  };
  const appendIdea = (idea) => {
    setIdeas([
      ...ideas,
      {
        id: ideas.length + 1,
        ...idea,
      },
    ]);
    setName("");
    setTagline("");
  };
  const removeIdea = (id) => {
    setIdeas(ideas.filter((idea) => idea.id !== id));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hide my idea</h1>
      </header>
      <form>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          ></input>
        </div>
        <div className="form-group">
          <label>Tag line</label>
          <textarea
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
          ></textarea>
        </div>
        <input
          type="submit"
          value="➕"
          onClick={(event) => {
            event.preventDefault();
            appendIdea({ name, tagline });
          }}
        />
        <div className="form-group">
          <label>Find ideas to hide amongst</label>
          <input type="text" value={term} onChange={fetchIdeas}></input>
          <input
            type="submit"
            value="✖︎"
            onClick={(event) => {
              event.preventDefault();
              setFoundIdeas([]);
            }}
          />
        </div>
        <ul>
          {foundIdeas.map(({ id, name, tagline }) => (
            <li key={id}>
              {name}
              <br />
              {tagline}
              <input
                type="submit"
                value="➕"
                onClick={(event) => {
                  event.preventDefault();
                  appendIdea({ name, tagline });
                }}
              />
            </li>
          ))}
        </ul>
      </form>
      <ul>
        {ideas.map(({ id, name, tagline }) => (
          <li key={id}>
            {name}
            <br />
            {tagline}
            <input type="submit" value="✖︎" onClick={() => removeIdea(id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
