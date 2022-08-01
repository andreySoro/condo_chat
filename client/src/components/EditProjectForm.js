import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ProjectMutations } from "../graphql/mutations";
import { FaCheck } from "react-icons/fa";
import "./style.css";

function EditProjectForm({ project }) {
  const statusMap = new Map();
  statusMap
    .set("Not started", "new")
    .set("In progress", "progress")
    .set("Completed", "completed");
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState(statusMap.get(project.status));
  const [updateOk, setUpdateOk] = useState(false);

  useEffect(() => {
    const timeOut =
      updateOk &&
      setTimeout(() => {
        setUpdateOk(false);
      }, 3000);
    return () => clearTimeout(timeOut);
  }, [updateOk]);

  const [updateProject] = useMutation(ProjectMutations.UPDATE_PROJECT, {
    variables: { name, description, status, id: project.id },
    onCompleted: () => setUpdateOk(true),
    refetchQueries: [{ query: ProjectMutations.GET_PROJECTS }],
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !status.trim()) {
      alert("Please fill in all fields");
      return;
    }
    updateProject(name, description, status);
  };

  return (
    <div className="mt-5">
      <div
        style={{ maxHeight: "40px" }}
        className="w-100 d-flex flex-row align-items-center"
      >
        <h3>Update project details</h3>
        {updateOk && (
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            {" "}
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />{" "}
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        )}
      </div>

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="new">Not started</option>
            <option value="progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}

export default EditProjectForm;
