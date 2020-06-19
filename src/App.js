import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function Idea({ idea, index, removeIdea }) {
  return (
    <Draggable draggableId={`${idea.id}-${idea.nam}`} index={index}>
      {(provided) => (
        <li
          className="list-group-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <strong>{idea.name}</strong>
          <br />
          {idea.tagline}
          <input
            type="submit"
            value="✖︎"
            onClick={() => removeIdea(idea.id)}
            className="float-right"
          />
        </li>
      )}
    </Draggable>
  );
}

const IdeaList = React.memo(function IdeaList({ ideas, removeIdea }) {
  return (
    <ul className="list-group">
      {ideas.map((idea, index) => (
        <Idea idea={idea} index={index} key={idea.id} removeIdea={removeIdea} />
      ))}
    </ul>
  );
});

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
  const appendIdea = (idea) => {
    setIdeas([
      ...ideas,
      {
        id: Math.max(...ideas.map(({ id }) => id)) + 1,
        ...idea,
      },
    ]);
    setName("");
    setTagline("");
  };
  const removeIdea = (id) => {
    setIdeas(ideas.filter((idea) => idea.id !== id));
  };

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reorderedIdeas = reorder(
      ideas,
      result.source.index,
      result.destination.index
    );

    setIdeas([...reorderedIdeas]);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hide my idea</h1>
      </header>
      <div className="container">
        <div className="row">
          <div className="col">
            <form>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="form-control"
                ></input>
              </div>
              <div className="form-group">
                <label>Tag line</label>
                <textarea
                  value={tagline}
                  onChange={(event) => setTagline(event.target.value)}
                  className="form-control"
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
          </div>
        </div>
        <div className="row">
          <div className="col">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    <IdeaList ideas={ideas} removeIdea={removeIdea} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
