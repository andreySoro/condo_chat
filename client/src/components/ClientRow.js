import { FaTrash } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { ClientMutations } from "../graphql/mutations.js";
import { ClientQueries } from "../graphql/queries.js";

function ClientRow({ client }) {
  const [deleteClient] = useMutation(ClientMutations.DELETE_CLIENT, {
    variables: { id: client.id },
    // refetchQueries: [{ query: ClientQueries.GET_CLIENTS }],
    update(cache) {
      const { clients } = cache.readQuery({
        query: ClientQueries.GET_CLIENTS,
      });
      cache.writeQuery({
        query: ClientQueries.GET_CLIENTS,
        data: { clients: clients.filter((c) => c.id !== client.id) },
      });
    },
  });

  return (
    <tr>
      <td>{client.name}</td>
      <td>{client.email}</td>
      <td>{client.phone}</td>
      <td>
        <button
          onClick={() => deleteClient()}
          className="btn btn-sm btn-danger"
          style={{ display: "flex", alignItems: "center" }}
        >
          Delete <FaTrash style={{ marginLeft: "5px" }} />
        </button>
      </td>
    </tr>
  );
}

export default ClientRow;
