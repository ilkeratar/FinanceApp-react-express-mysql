import React from "react";

function Accounts({
  userList,
  accountList,
  handleSubmitAccounts,
  user_name,
  setUserName,
  account_name,
  setAccountName,
  currency_type,
  setCurrencyType,
  deleteAccount,
}) {
  return (
    <div className="col-md-4">
      <div className="formArea">
        <h4 className="mb-4">CREATE NEW ACCOUNT</h4>
        <form onSubmit={handleSubmitAccounts}>
          <div className="form-group mb-2">
            <label className="form-label">Account Name:</label>
            <input
              type="text"
              name="accountName"
              value={account_name}
              className="form-control"
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
          <div className="form-group mb-2">
            <label className="form-label">User:</label>
            <select
              value={user_name}
              onChange={(e) => setUserName(e.target.value)}
              className="form-control"
            >
              <option value="">Select User</option>
              {userList.map((item, i) => {
                return (
                  <option value={item.username} key={i}>
                    {item.username}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group mb-2">
            <label className="form-label">Currency Type:</label>
            <select
              value={currency_type}
              onChange={(e) => setCurrencyType(e.target.value)}
              className="form-control"
            >
              <option value="">Select Type</option>
              <option value="TL">TL</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
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
            <th>UserID</th>
            <th>Account Name</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accountList.map((item, i) => {
            return (
              <tr key={i}>
                <td>{item.id}</td>
                <td>{item.user_id}</td>
                <td>{item.account_name}</td>
                <td>{item.balance}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      deleteAccount(item.id);
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

export default Accounts;
