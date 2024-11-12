import { useEffect, useState } from "react";
import userService from "../services/users";
import { Link } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    userService.getAll().then(setUsers);
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.name}</Link> - {user.blogs.length} blogs
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
