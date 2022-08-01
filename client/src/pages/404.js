import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <FaExclamationTriangle className="text-danger" size="4rem" />
      <h2>404 not found</h2>
      <p className="lead">Sorry, this page does not exist</p>
      <Link to="/" className="btn btn-primary">
        Go back to home page
      </Link>
    </div>
  );
}

export default NotFound;
