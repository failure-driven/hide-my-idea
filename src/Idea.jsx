import React from "react";
import { Draggable } from "react-beautiful-dnd";

export default function Idea({ idea, index, removeIdea }) {
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
