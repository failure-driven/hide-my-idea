import React, { useState } from "react";
import AddIdeaForm from "./AddIdeaForm";
import SortableIdeaList from "./SortableIdeaList";
import FindIdeaForm from "./FindIdeaForm";
import "./App.css";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function App() {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [ideas, setIdeas] = useState([
    {
      id: 0,
      name: "demo name",
      tagline: "demo tagline",
    },
  ]);

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
            <AddIdeaForm
              name={name}
              setName={setName}
              tagline={tagline}
              setTagline={setTagline}
              appendIdea={appendIdea}
            />
            <FindIdeaForm appendIdea={appendIdea} />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h2>The idea list</h2>
            <SortableIdeaList
              ideas={ideas}
              removeIdea={removeIdea}
              onDragEnd={onDragEnd}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
