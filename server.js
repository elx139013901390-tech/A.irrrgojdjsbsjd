const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

/* =====================
ثبت نام
===================== */

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

/* =====================
ورود
===================== */

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

if(user.banned){

return res.json({
success:false,
message:"حساب شما مسدود شده است"
});

}

const valid =
await bcrypt.compare(
password,
user.password
);

if(!valid){

return res.json({
success:false,
message:"رمز عبور اشتباه است"
});

}

const token =
jwt.sign(
{
id:user.id,
username:user.username,
role:user.role
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
balance:user.balance,
points:user.points
});

}catch(err){

res.status(500).json({
success:false,
error:err.message
});

}

});

/* =====================
رتبه بندی
===================== */

app.get("/api/leaderboard",
async(req,res)=>{

const [users] =
await db.query(
"SELECT username, country, points FROM users ORDER BY points DESC LIMIT 100"
);

res.json(users);

});

/* =====================
اخبار
===================== */

app.get("/api/news",
async(req,res)=>{

const [rows] =
await db.query(
"SELECT * FROM news ORDER BY id DESC"
);

res.json(rows);

});

/* =====================
اجرای سرور
===================== */

const PORT =
process.env.PORT || 3000;

app.listen(PORT,()=>{

console.log(
"🔥 COP2026 GOLD RUNNING"
);

});
