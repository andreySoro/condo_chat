import { Link, useParams } from "react-router-dom";
import { ProjectQueries } from "../graphql/queries";
import { ProjectMutations } from "../graphql/mutations";
import Spinner from "../components/Spinner";
import { useQuery, useMutation } from "@apollo/client";
import ClientInfo from "../components/ClientInfo";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import EditProjectForm from "../components/EditProjectForm";

function Project() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(ProjectQueries.GET_PROJECT, {
    variables: { id },
  });
  const navigate = useNavigate();

  //DELETE PROJECT
  const [deleteProject] = useMutation(ProjectMutations.DELETE_PROJECT, {
    variables: { id: data?.project?.id },
    onCompleted: () => navigate("/"),
  });
  if (loading) return <Spinner />;
  if (error) return <p>Error :(</p>;
  return (
    <>
      {!loading && !error && (
        <div className="mx-auto w-75 card p-5">
          <Link to="/" className="btn btn-light btn-sm w-25 d-inline ms-auto">
            Back
          </Link>
          <h1>{data.project.name}</h1>
          <p>{data.project.description}</p>

          <h5 className="mt-3">Project status</h5>
          <p className="lead">{data.project.status}</p>
          <ClientInfo client={data.project.client} />
          <EditProjectForm project={data.project} />
          <button
            onClick={deleteProject}
            className="btn btn-danger mt-5 d-flex justify-content-center align-items-center"
          >
            <FaTrash className="me-2" />
            Delete project
          </button>
        </div>
      )}
    </>
  );
}

export default Project;
