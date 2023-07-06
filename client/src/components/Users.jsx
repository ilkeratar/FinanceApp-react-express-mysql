import React from "react";

function Users({
  handleSubmitUsers,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  userList,
  deleteUser,
}) {
  return (
    <div className="col-md-4">
      <div className="formArea">
        <h4 className="mb-4">ADD A NEW USER</h4>
        <form onSubmit={handleSubmitUsers}>
          <div className="mb-2">
            <label className="form-label">User Name:</label>
            <input
              type="text"
              name="username"
              value={username}
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary mb-2">
            Submit
          </button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((item, i) => {
            return (
              <tr key={i}>
                <td>{item.id}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      deleteUser(item.username);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
