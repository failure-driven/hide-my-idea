import React from "react";
import Idea from "./Idea";

const IdeaList = React.memo(function IdeaList({ ideas, removeIdea }) {
  return (
    <ul className="list-group">
      {ideas.map((idea, index) => (
        <Idea idea={idea} index={index} key={idea.id} removeIdea={removeIdea} />
      ))}
    </ul>
  );
});
export default IdeaList;
