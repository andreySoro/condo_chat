import { gql } from "@apollo/client";

// CLIENT BASED MUTATIONS
export const ClientMutations = {
  ADD_CLIENT: gql`
    mutation addClient($name: String!, $email: String!, $phone: String!) {
      addClient(name: $name, email: $email, phone: $phone) {
        id
        name
        email
        phone
      }
    }
  `,

  DELETE_CLIENT: gql`
    mutation deleteClient($id: ID!) {
      deleteClient(id: $id) {
        id
        name
        email
        phone
      }
    }
  `,
};

//PROJECT BASED MUTATIONS
export const ProjectMutations = {
  ADD_PROJECT: gql`
    mutation AddProject(
      $name: String!
      $description: String!
      $clientId: ID!
      $status: ProjectStatus!
    ) {
      addProject(
        name: $name
        description: $description
        clientId: $clientId
        status: $status
      ) {
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

  UPDATE_PROJECT: gql`
    mutation UpdateProject(
      $id: ID!
      $name: String!
      $description: String!
      $status: ProjectStatusUpdate!
    ) {
      updateProject(
        id: $id
        name: $name
        description: $description
        status: $status
      ) {
        id
        name
        description
        status
        client {
          id
          name
          phone
          email
        }
      }
    }
  `,

  DELETE_PROJECT: gql`
    mutation DeleteProject($id: String!) {
      deleteProject(id: $id) {
        id
      }
    }
  `,
};
