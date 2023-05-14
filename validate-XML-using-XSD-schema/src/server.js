const express = require("express");
const db = require("./database");
const cors = require("cors");
const xmlBodyParser = require("express-xml-bodyparser");
const valid = require("./valid");

const app = express();
app.use(cors());
app.use(xmlBodyParser());

//test database connection
db.connect()
    .then((client) => {
        return client
            .query("SELECT NOW()")
            .then((res) => {
                client.release();
                console.log(res.rows);
            })
            .catch((err) => {
                client.release();
                console.log(err.stack);
            });
    })
    .catch((err) => {
        console.log(err);
    });

//Routes
app.get("/", (req, res) => {
    res.set("Content-Type", "application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
                    <message>hello world!</message>`);
});

// Use the parsed schema in your routes
app.get("/customers", async (req, res) => {
    try {
        const conn = await db.connect();
        const sql = `SELECT * FROM customer`;
        const result = await conn.query(sql);
        conn.release();

        const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
      <customers>
        ${result.rows
            .map(
                (row) => `
          <customer>
            <customer_id>${row.customer_id}</customer_id>
            <first_name>${row.first_name}</first_name>
            <last_name>${row.last_name}</last_name>
            <age>${row.age}</age>
            <city>${row.city}</city>
            <street>${row.street}</street>
            <building>${row.building}</building>
            <apartment>${row.apartment}</apartment>
            <phone>${row.phone}</phone>
            <email>${row.email}</email>
          </customer>
        `
            )
            .join("\n")}
      </customers>`;

        // Set the Content-Type header to application/xml
        res.set("Content-Type", "application/xml");

        // Send the XML response
        res.send(xmlResponse);
    } catch (error) {
        res.set("Content-Type", "application/xml");
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
        <error>
          <message>Unable to get the requested customer:</message>
          <details>${error.message}</details>
        </error>`);
    }
});

app.post("/customers", valid.customerValidator, async (req, res) => {
    const customerData = req.body.customer;

    try {
        const conn = await db.connect();
        const sql = `
      INSERT INTO customer (
        customer_id,
        first_name,
        last_name,
        age,
        city,
        street,
        building,
        apartment,
        phone,
        email
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;
        const values = [
            customerData.customer_id[0],
            customerData.first_name[0],
            customerData.last_name[0],
            customerData.age[0],
            customerData.city[0],
            customerData.street[0],
            customerData.building[0],
            customerData.apartment[0],
            customerData.phone[0],
            customerData.email[0],
        ];

        await conn.query(sql, values);
        conn.release();

        res.json({ msg: "Customer data inserted successfully" });
    } catch (error) {
        const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
      <error>
        <message>Unable to insert customer data</message>
        <details>${error.message}</details>
      </error>`;
        res.set("Content-Type", "application/xml");
        res.send(errorXml);
    }
});

app.get("/canceled_order", async (req, res) => {
    try {
        //opn connection
        const conn = await db.connect();
        const sql = `SELECT * FROM canceled_order`;

        //run query
        const result = await conn.query(sql);

        //close connection
        conn.release();

        //return all users
        return res.json(result.rows);
    } catch (error) {
        res.json({
            err: `unable to get the requested product`,
            error: error.message,
        });
    }
});

//NOT FOUND ROUTES
app.use((_req, res) => {
    res.status(404).json({
        message: "THAT IS WRONG ROUTE!!",
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
