import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles/styles.module.css";

const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { name, email, dob };

    axios
      .post("http://localhost:5000/api/submit", { formData })
      .then(() => {
        fetchUsers();
        setName("");
        setEmail("");
        setDob("");
      })
      .catch((error) => console.log("Error:", error));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/users/${id}`)
      .then(() => fetchUsers())
      .catch((error) => console.log("Error deleting user:", error));
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setName(user.name);
    setEmail(user.email);
    setDob(new Date(user.dob).toISOString().split("T")[0]);
  };

  const handleUpdate = () => {
    const formData = { name, email, dob };

    axios
      .put(`http://localhost:5000/api/users/${editUser._id}`, { formData })
      .then(() => {
        fetchUsers();
        setEditUser(null);
        setName("");
        setEmail("");
        setDob("");
      })
      .catch((error) => console.log("Error updating user:", error));
  };

  return (
    <div className={`${styles.parent} container-fluid`}>
      <div id={styles.registerForm}>
        <div id={styles.example}>
          <h2>{editUser ? "Edit User" : "Register"}</h2>
          <form
            onSubmit={editUser ? handleUpdate : handleSubmit}
            id={styles.formBox}
          >
            <div className={`${styles.inputBox} input-group mb-3`}>
              <span className={`${styles.formSpan} input-group-text`}>
                Name
              </span>
              <input
                type="text"
                className={`form-control ${styles.inputBoxField}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={`${styles.inputBox} input-group mb-3`}>
              <span className={`${styles.formSpan} input-group-text`}>
                Email
              </span>
              <input
                type="email"
                className={`form-control ${styles.inputBoxField}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={`${styles.inputBox} input-group mb-3`}>
              <span className={`${styles.formSpan} input-group-text`}>DOB</span>
              <input
                type="date"
                className={`form-control ${styles.inputBoxField}`}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <button type="submit" id={styles.submitBtn}>
              {editUser ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <div id={styles.loggedUser}>
        {users.length > 0 && (
          <>
            <h3 id={styles.tableHeader}>Registered Users</h3>
            <table className={`${styles.tableParent} table table-bordered`}>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.dob).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i
                          className={`${styles.pencil} fa-solid fa-pencil`}
                        ></i>{" "}
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        <i className={`${styles.trash} fa-solid fa-trash`}></i>{" "}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
