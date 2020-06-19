import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import IdeaList from "./IdeaList";

export default function SortableIdeaList({ ideas, removeIdea, onDragEnd }) {
  return (
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
  );
}
