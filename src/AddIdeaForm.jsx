import React from "react";

export default function AddIdeaForm({
  name,
  setName,
  tagline,
  setTagline,
  appendIdea,
}) {
  return (
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
    </form>
  );
}
