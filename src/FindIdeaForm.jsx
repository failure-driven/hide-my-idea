import React, { useState } from "react";

export default function FindIdeaForm({ appendIdea }) {
  const [term, setTerm] = useState("");
  const [foundIdeas, setFoundIdeas] = useState([]);

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
          const nameAndTagline = data.hits.map(({ id, name, tagline }) => {
            return {
              id,
              name,
              tagline,
            };
          });

          setFoundIdeas(nameAndTagline);
        })
      );
  };

  return (
    <form>
      <div className="form-group">
        <label>Find ideas to hide amongst</label>
        <input
          type="text"
          value={term}
          onChange={fetchIdeas}
          className="form-control"
        />
      </div>
      <input
        type="submit"
        value="✖︎"
        onClick={(event) => {
          event.preventDefault();
          setFoundIdeas([]);
        }}
        className="float-right"
      />
      <ul className="list-group">
        {foundIdeas.map(({ id, name, tagline }) => (
          <li key={id} className="list-group-item">
            <br />
            {name}
            <br />
            {tagline}
            <input
              type="submit"
              value="➕"
              onClick={(event) => {
                event.preventDefault();
                setFoundIdeas(
                  foundIdeas.filter((foundIdea) => foundIdea.id !== id)
                );
                appendIdea({ name, tagline });
              }}
              className="float-right"
            />
          </li>
        ))}
      </ul>
    </form>
  );
}
