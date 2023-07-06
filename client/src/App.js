import React, { useEffect, useState } from "react";
import "./App.css";
import Axios from "axios";
import Users from "./components/Users";
import Accounts from "./components/Accounts";
import Transactions from "./components/Transactions";

function App() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);
  const [user_name, setUserName] = useState('');
  const [account_name, setAccountName] = useState("");
  const [currency_type, setCurrencyType] = useState("");
  const [accountList, setAccountList] = useState([]);
  const [selected_account_name, setSelectedAccountName] = useState("");
  const [transaction_type, setTransactionType] = useState("");
  const [transaction_amount, setTransactionAmount] = useState(0);
  const [transactionList, setTransactionList] = useState([]);
  const [selected_transfer_account, setSelectedTransferAccount] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/api/users")
      .then((response) => {
        setUserList(response.data);
      })
      .catch((err) => {
        if (err.code === "ECONNABORTED") {
          // Zaman aşımı hatası
          console.error("İstek zaman aşımına uğradı.");
        } else {
          // Diğer hatalar
          console.error(err);
        }
      });
    Axios.get("http://localhost:3001/api/accounts")
      .then((response) => {
        setAccountList(response.data);
      })
      .catch((err) => {
        if (err.code === "ECONNABORTED") {
          // Zaman aşımı hatası
          console.error("İstek zaman aşımına uğradı.");
        } else {
          // Diğer hatalar
          console.error(err);
        }
      });
      Axios.get("http://localhost:3001/api/transactions")
      .then((response) => {
        setTransactionList(response.data);
      })
      .catch((err) => {
        if (err.code === "ECONNABORTED") {
          // Zaman aşımı hatası
          console.error("İstek zaman aşımına uğradı.");
        } else {
          // Diğer hatalar
          console.error(err);
        }
      });
  }, [userList, accountList,transactionList]);

  const handleSubmitUsers = (e) => {
    if(username ==='' || email==='' || password==='')
    {
      alert('Make sure you fill in the blanks');
      e.preventDefault();
      return;
    }
    e.preventDefault();
    Axios.post("http://localhost:3001/api/users", {
      username: username,
      email: email,
      password: password,
    })
      .then(() => {
        setUserList([
          ...userList,
          {
            username,
            email,
            password,
          },
        ]);
      })
      .catch((err) => {
        if (err.code === "ECONNABORTED") {
          // Zaman aşımı hatası
          console.error("İstek zaman aşımına uğradı.");
        } else {
          // Diğer hatalar
          console.error(err);
        }
      });
    setUsername("");
    setEmail("");
    setPassword("");
  };
  const handleSubmitAccounts = (e) => {
    if(user_name ==='' || account_name==='' || currency_type==='')
    {
      alert('Make sure you fill in the blanks');
      e.preventDefault();
      return;
    }
    let user_id=userList.find((item)=> item.username === user_name).id;
    e.preventDefault();
    Axios.post("http://localhost:3001/api/accounts", {
      user_id: user_id,
      account_name: account_name,
      currency_type: currency_type,
    })
      .then(() => {
        setAccountList([
          ...accountList,
          {
            user_id,
            account_name,
            currency_type,
          },
        ]);
      })
      .catch((err) => {
        if (err.code === "ECONNABORTED") {
          // Zaman aşımı hatası
          console.error("İstek zaman aşımına uğradı.");
        } else {
          // Diğer hatalar
          console.error(err);
        }
      });
    setAccountName("");
    setUserName("");
    setCurrencyType("");
  };
  const handleSubmitTransactions = (e) => {
    if(selected_account_name ==='' || transaction_type==='' || transaction_amount==='' || (transaction_type==="Transfer" && selected_transfer_account===""))
    {
      alert('Make sure you fill in the blanks');
      e.preventDefault();
      return;
    }
    let account_id=accountList.find((item)=> item.account_name === selected_account_name).id;
    e.preventDefault();
    if(transaction_type==="Withdraw" || transaction_type==="Deposit"){
      Axios.post("http://localhost:3001/api/transactions", {
      account_id: account_id,
      transaction_type: transaction_type,
      transaction_amount: transaction_amount,
    })
      .then(() => {
        setTransactionList([
          ...transactionList,
          {
            account_id,
            transaction_type,
            transaction_amount,
          },
        ]);
      })
      .catch((err) => {
        if (err.code === "ECONNABORTED") {
          // Zaman aşımı hatası
          console.error("İstek zaman aşımına uğradı.");
        } else {
          // Diğer hatalar
          console.error(err);
        }
      });
    }
    else if(transaction_type==="Transfer"){
      let transfer_to=accountList.find((item)=> item.account_name===selected_transfer_account).id;
      Axios.post("http://localhost:3001/api/transactions", {
      account_id: account_id,
      transaction_type: transaction_type,
      transaction_amount: transaction_amount,
      transfer_to:transfer_to,
    })
      .then(() => {
        setTransactionList([
          ...transactionList,
          {
            account_id,
            transaction_type,
            transaction_amount,
            transfer_to
          },
        ]);
      })
      .catch((err) => {
        if (err.code === "ECONNABORTED") {
          // Zaman aşımı hatası
          console.error("İstek zaman aşımına uğradı.");
        } else {
          // Diğer hatalar
          console.error(err);
        }
      });
    }
    
    setTransactionAmount(0);
    setTransactionType("");
    setSelectedAccountName("");
    setSelectedTransferAccount("");
  };

  const deleteUser = (name) => {
    Axios.delete(`http://localhost:3001/api/users/${name}`);
  };
  const deleteAccount = (id) => {
    Axios.delete(`http://localhost:3001/api/accounts/${id}`);
  };
  const deleteTransaction = (id) => {
    Axios.delete(`http://localhost:3001/api/transactions/${id}`);
  };

  return (
    <div className="App">
      <div className="row">
        <Users
          handleSubmitUsers={handleSubmitUsers}
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          userList={userList}
          deleteUser={deleteUser}
        />
        <Accounts
          userList={userList}
          accountList={accountList}
          handleSubmitAccounts={handleSubmitAccounts}
          user_name={user_name}
          setUserName={setUserName}
          account_name={account_name}
          setAccountName={setAccountName}
          currency_type={currency_type}
          setCurrencyType={setCurrencyType}
          deleteAccount={deleteAccount}
        />
        <Transactions
          accountList={accountList}
          transactionList={transactionList}
          handleSubmitTransactions={handleSubmitTransactions}
          selected_account_name={selected_account_name}
          setSelectedAccountName={setSelectedAccountName}
          transaction_type={transaction_type}
          setTransactionType={setTransactionType}
          transaction_amount={transaction_amount}
          setTransactionAmount={setTransactionAmount}
          deleteTransaction={deleteTransaction}
          selected_transfer_account={selected_transfer_account}
          setSelectedTransferAccount={setSelectedTransferAccount}
          />
      </div>
    </div>
  );
}

export default App;
