import { gql } from "@apollo/client";

// CLIENT BASED QUERIES
export const ClientQueries = {
  GET_CLIENTS: gql`
    query getClients {
      clients {
        id
        name
        email
        phone
      }
    }
  `,
};

//PROJECT BASED QUERIES
export const ProjectQueries = {
  GET_PROJECTS: gql`
    query getProjects {
      projects {
        id
        name
        description
        status
        client {
          id
          name
          email
          phone
        }
      }
    }
  `,
  GET_PROJECT: gql`
    query getProject($id: ID!) {
      project(id: $id) {
        id
        name
        description
        status
        client {
          id
          name
          email
          phone
        }
      }
    }
  `,
};
