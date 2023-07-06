import React, { useState } from "react";


function Transactions({
  accountList,
  transactionList,
  handleSubmitTransactions,
  selected_account_name,
  setSelectedAccountName,
  transaction_type,
  setTransactionType,
  transaction_amount,
  setTransactionAmount,
  deleteTransaction,
  selected_transfer_account,
  setSelectedTransferAccount
}) {
  const [showAdditionalBox, setShowAdditionalBox] = useState(false);
  

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    setTransactionType(selectedOption);

    if (selectedOption === 'Transfer') {
      setShowAdditionalBox(true);
    } else {
      setShowAdditionalBox(false);
    }
  };

  return (
    <div className="col-md-4">
      <div className="formArea">
        <h4 className="mb-4">CREATE NEW TRANSACTION</h4>
        <form onSubmit={handleSubmitTransactions}>
          <div className="form-group mb-2">
            <label className="form-label">Account:</label>
            <select
              value={selected_account_name}
              onChange={(e) => setSelectedAccountName(e.target.value)}
              className="form-control"
            >
              <option value="">Select Account</option>
              {accountList.map((item, i) => {
                return (
                  <option value={item.account_name} key={i}>
                    {item.id} {item.account_name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group mb-2">
            <label className="form-label">Type:</label>
            <select
              value={transaction_type}
              onChange={handleSelectChange}
              className="form-control"
            >
              <option value="">Select Type</option>
              <option value="Withdraw">Withdraw</option>
              <option value="Deposit">Deposit</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>
          {showAdditionalBox && (
            <div className="form-group mb-2">
            <label className="form-label">Pay To:</label>
            <select
              value={selected_transfer_account}
              onChange={(e) => setSelectedTransferAccount(e.target.value)}
              className="form-control"
            >
              <option value="">Select Account</option>
              {accountList.map((item, i) => {
                if(item.account_name !== selected_account_name){
                  return (
                    <option value={item.account_name} key={i}>
                      {item.id} {item.account_name}
                    </option>
                  );
                }
                return null;
               
              })}
            </select>
          </div>
          )}
          <div className="form-group mb-2">
            <label className="form-label">Amount:</label>
            <input
              type="number"
              name="amount"
              value={transaction_amount}
              className="form-control"
              onChange={(e) => setTransactionAmount(e.target.value)}
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
            <th>AccountID</th>
            <th>Type</th>
            <th>Amount</th>
            <th>TransferID</th>
            <th>Creation Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactionList.map((item, i) => {
            return (
              <tr key={i}>
                <td>{item.id}</td>
                <td>{item.account_id}</td>
                <td>{item.type}</td>
                <td>{item.amount}</td>
                <td>{item.transfer_to ? item.transfer_to : "-"}</td>
                <td>{item.created_at}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      deleteTransaction(item.id);
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

export default Transactions;
