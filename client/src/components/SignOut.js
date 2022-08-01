import { FaUser } from "react-icons/fa";

function SignOut({ setToken }) {
  const signOut = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <button onClick={signOut} type="button" className="btn btn-primary">
      <div className="d-flex align-items-center">
        <FaUser className="icon" />
        <div>Sign out</div>
      </div>
    </button>
  );
}

export default SignOut;
