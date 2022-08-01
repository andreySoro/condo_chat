import Spinner from "./Spinner";
import { useQuery } from "@apollo/client";
import { ProjectQueries } from "../graphql/queries.js";
import ProjectCard from "./ProjectCard";

function Projects() {
  const { loading, error, data } = useQuery(ProjectQueries.GET_PROJECTS);

  if (loading)
    return (
      <div style={{ minHeight: "150px" }}>
        <Spinner />
      </div>
    );
  if (error) return <p>Something went wrong :(</p>;

  return (
    <>
      {data?.projects?.length > 0 ? (
        <div className="row mt-4">
          {data.projects.map((project) => {
            return <ProjectCard key={project?.id} project={project} />;
          })}
        </div>
      ) : (
        <p>No projects found</p>
      )}
    </>
  );
}

export default Projects;
