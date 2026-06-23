const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

const db = require("./db");

/* REGISTER */

app.post("/api/register", async (req,res)=>{

try{

const {
username,
password,
country,
favorite_team
} = req.body;

const [exists] =
await db.query(
"SELECT id FROM users WHERE username=?",
[username]
);

if(exists.length){

return res.json({
success:false,
message:"نام کاربری قبلا ثبت شده است"
});

}

const hash =
await bcrypt.hash(password,10);

await db.query(
"INSERT INTO users (username,password,country,favorite_team) VALUES(?,?,?,?)",
[
username,
hash,
country,
favorite_team
]
);

res.json({
success:true,
message:"ثبت نام موفق"
});

}catch(err){

res.status(500).json({
success:false,
error:err.message
});

}

});

/* LOGIN */

app.post("/api/login", async(req,res)=>{

try{

const {
username,
password
} = req.body;

const [users] =
await db.query(
"SELECT * FROM users WHERE username=?",
[username]
);

if(!users.length){

return res.json({
success:false,
message:"کاربر یافت نشد"
});

}

const user = users[0];

const valid =
await bcrypt.compare(
password,
user.password
);

if(!valid){

return res.json({
success:false,
message:"رمز اشتباه است"
});

}

const token =
jwt.sign(
{
id:user.id,
username:user.username
},
process.env.JWT_SECRET,
{
expiresIn:"7d"
}
);

res.json({
success:true,
token,
id:user.id,
username:user.username,
balance:user.balance
});

}catch(err){

res.status(500).json({
success:false,
error:err.message
});

}

});

/* LEADERBOARD */

app.get("/api/leaderboard", async(req,res)=>{

const [rows] =
await db.query(
"SELECT username,country,points FROM users ORDER BY points DESC"
);

res.json(rows);

});

/* NEWS */

app.get("/api/news", async(req,res)=>{

const [rows] =
await db.query(
"SELECT * FROM news ORDER BY id DESC"
);

res.json(rows);

});

/* WALLET */

app.get("/api/wallet/:id", async(req,res)=>{

const id = req.params.id;

const [rows] =
await db.query(
"SELECT balance FROM users WHERE id=?",
[id]
);

res.json(rows[0]);

});

/* TRANSFER */

app.post("/api/transfer", async(req,res)=>{

try{

const {
senderId,
receiverUsername,
amount
} = req.body;

const [sender] =
await db.query(
"SELECT * FROM users WHERE id=?",
[senderId]
);

if(!sender.length){

return res.json({
success:false,
message:"فرستنده پیدا نشد"
});

}

if(sender[0].balance < amount){

return res.json({
success:false,
message:"موجودی کافی نیست"
});

}

const [receiver] =
await db.query(
"SELECT * FROM users WHERE username=?",
[receiverUsername]
);

if(!receiver.length){

return res.json({
success:false,
message:"کاربر مقصد پیدا نشد"
});

}

await db.query(
"UPDATE users SET balance=balance-? WHERE id=?",
[amount,senderId]
);

await db.query(
"UPDATE users SET balance=balance+? WHERE id=?",
[amount,receiver[0].id]
);

await db.query(
"INSERT INTO wallet_transactions (sender_id,receiver_id,amount) VALUES(?,?,?)",
[
senderId,
receiver[0].id,
amount
]
);

res.json({
success:true,
message:"انتقال انجام شد"
});

}catch(err){

res.status(500).json({
success:false,
error:err.message
});

}

});

/* TRANSACTIONS */

app.get("/api/transactions/:userId", async(req,res)=>{

const userId = req.params.userId;

const [rows] =
await db.query(
"SELECT * FROM wallet_transactions WHERE sender_id=? OR receiver_id=? ORDER BY id DESC",
[userId,userId]
);

res.json(rows);

});

/* SERVER */

const PORT =
process.env.PORT || 3000;

app.listen(PORT,()=>{

console.log(
"🔥 COP2026 GOLD RUNNING"
);

});
