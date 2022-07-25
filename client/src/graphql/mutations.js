import { gql } from "@apollo/client";

// CLIENT BASED QUERIES
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
