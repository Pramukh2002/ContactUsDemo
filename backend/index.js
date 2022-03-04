const express = require("express");
const path = require('path');
const date = require('date-format');
const bodyParser = require('body-parser');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

var DBUrl = "mongodb://localhost:27017/db";

const PORT = 3007;

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.post("/contact_us", (req, res) => {
    var EmailId = req.body.EmailId;
    var Name = req.body.Name;
    var Message = req.body.Message;

    if(EmailId != '' && Name != '' && Message != '')
    {
        MongoClient.connect(DBUrl, function(err, db) {
            if (err) throw err;

            var CDate = date('dd/MM/yyyy', new Date());
            var CTime = date('hh:mm:ss', new Date());

            var dbo = db.db("db");
            var Record = {
                entry_date: CDate + " " + CTime,
                email_id: EmailId,
                name: Name,
                message: Message
            };
            dbo.collection("ContactRequests").insertOne(Record, function(err, db_res){
                if(err) throw err;
                db.close();

                res.json({
                    'Status': 'Done'
                });
            });
        });
    }
    else
    {
        res.json({
            'Status': 'Invalid'
        })
    }
});

app.get("/get_records", (req, res) => {
    const csvWriter = createCsvWriter({
        path: 'list.csv',
        header: [
            {id: 'email_id', title: 'Email Id'},
            {id: 'name', title: 'Name'},
            {id: 'message', title: 'Message'}
        ]
    });
    
    const Records = [];
    MongoClient.connect(DBUrl, function(err, db) {
        if (err) throw err;

        var dbo = db.db("db");
        dbo.collection("ContactRequests").find({}).toArray(function(err, result){
            if(err) throw err;
            db.close();

            for (let i = 0; i < result.length; i++)
            {
                const Record = result[i];
                Records.push({
                    email_id: Record['email_id'],
                    name: Record['name'],
                    message: Record['message']
                });
            }

            csvWriter.writeRecords(Records).then(() => {
                res.download("list.csv");
                // res.set('Content-Type', 'text/csv');
                // res.setHeader('Content-Disposition', 'attachment; filename="list.csv"');
                // res.status(200).send(Records);
            })
        });
    });
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});