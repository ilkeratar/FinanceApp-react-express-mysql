const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "cruddb",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/users", (req, res) => {
  const sqlSelect = "SELECT * FROM users";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.get("/api/accounts", (req, res) => {
  const sqlSelect = "SELECT * FROM accounts";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.get("/api/transactions", (req, res) => {
  const sqlSelect = "SELECT * FROM transactions";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.post("/api/users", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const sqlInsert =
    "INSERT INTO users (username, email, password) VALUES (?,?,?)";
  db.query(sqlInsert, [username, email, password], (err, result) => {
    console.log(result);
  });
});

app.post("/api/accounts", (req, res) => {
  const user_id = req.body.user_id;
  const account_name = req.body.account_name;
  const currency_type = req.body.currency_type;

  const sqlInsert =
    "INSERT INTO accounts (user_id, account_name, currency_type) VALUES (?,?,?)";
  db.query(sqlInsert, [user_id, account_name, currency_type], (err, result) => {
    if (err) console.log(err);
    console.log(result);
  });
});

const withdrawTransaction = (account_id, type, amount) => {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        return reject("Error occurred while getting the connection");
      }
      return connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return reject("Error occurred while creating the transaction");
        }
        return connection.execute(
          "INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)",
          [account_id, type,amount],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return reject("Inserting to transactions table failed", err);
              });
            }
            return connection.execute(
              "UPDATE accounts SET balance = balance - ? WHERE id = ?",
              [amount,account_id],
              (err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    return reject("Updating to accounts table failed");
                  });
                }
                return connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      return reject("Commit failed");
                    });
                  }
                  connection.release();
                });
              }
            );
          }
        );
      });
    });
  });
};
const depositTransaction=(account_id, type, amount) =>{
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        return reject("Error occurred while getting the connection");
      }
      return connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return reject("Error occurred while creating the transaction");
        }
        return connection.execute(
          "INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)",
          [account_id, type,amount],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return reject("Inserting to transactions table failed", err);
              });
            }
            return connection.execute(
              "UPDATE accounts SET balance = balance + ? WHERE id = ?",
              [amount,account_id],
              (err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    return reject("Updating to accounts table failed");
                  });
                }
                return connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      return reject("Commit failed");
                    });
                  }
                  connection.release();
                });
              }
            );
          }
        );
      });
    });
  });
};
const transferTransaction=(account_id, type, amount,transfer_to) =>{
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        return reject("Error occurred while getting the connection");
      }
      return connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return reject("Error occurred while creating the transaction");
        }
        return connection.execute(
          "INSERT INTO transactions (account_id, type, amount,transfer_to) VALUES (?, ?, ?,?)",
          [account_id, type,amount,transfer_to],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return reject("Inserting to transactions table failed", err);
              });
            }
            return connection.execute(
              "UPDATE accounts SET balance = balance - ? WHERE id = ?",
              [amount,account_id],
              (err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    return reject("Update failed while decrementing from accounts table");
                  });
                }
                return connection.execute(
                  "UPDATE accounts SET balance = balance + ? WHERE id = ?",
                  [amount,transfer_to],
                  (err) => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        return reject("Update failed while incrementing from accounts table");
                      });
                    }
                    return connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => {
                          connection.release();
                          return reject("Commit failed");
                        });
                      }
                      connection.release();
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  });
};
app.post("/api/transactions", (req, res) => {
    const account_id = req.body.account_id;
    const type = req.body.transaction_type;
    const amount = req.body.transaction_amount;
  
    if(type==="Withdraw"){
      withdrawTransaction(account_id,type,amount).catch(err=>{
        console.log(err);
      });
    }else if(type==="Deposit"){
      depositTransaction(account_id,type,amount).catch(err=>{
        console.log(err);
      });
    }else if(type==="Transfer"){
       const transfer_to=req.body.transfer_to;
       transferTransaction(account_id,type,amount,transfer_to).catch(err=>{
        console.log(err);
      });
      }

});

app.delete("/api/users/:username", (req, res) => {
  const username = req.params.username;
  const sqlInsert = "DELETE FROM users WHERE username = ?";
  db.query(sqlInsert, username, (err, result) => {
    if (err) console.log(err);
  });
});

app.delete("/api/accounts/:id", (req, res) => {
  const id = req.params.id;
  const sqlInsert = "DELETE FROM accounts WHERE id = ?";
  db.query(sqlInsert, id, (err, result) => {
    if (err) console.log(err);
  });
});

app.delete("/api/transactions/:id", (req, res) => {
  const id = req.params.id;
  const sqlInsert = "DELETE FROM transactions WHERE id = ?";
  db.query(sqlInsert, id, (err, result) => {
    if (err) console.log(err);
  });
});

app.listen(3001, () => {
  console.log("running on port 3001");
});
