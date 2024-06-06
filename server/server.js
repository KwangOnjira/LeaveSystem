const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbSeq = require("./Config/index");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { readdirSync } = require('fs');
const path = require("path");
const https = require("https"); 
const fs = require("fs"); 
dotenv.config({ path: "./.env" });

const app = express();
const port = 5432;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.urlencoded({extended:true}));
app.use('/signatures', express.static(path.join(__dirname,'/signatures')));


dbSeq.sequelize.sync();
const options = { 
  key: fs.readFileSync("server.key"), 
  cert: fs.readFileSync("server.cert"), 
};

readdirSync('./Routes')
    .map((r)=> app.use('', require('./Routes/' + r)))

// app.listen(port, () => {
//   console.log(`Server is Running on port ${port}`);
// });

https.createServer(options, app) 
.listen(port, function (req, res) { 
  console.log("Server started at port 3000"); 
});