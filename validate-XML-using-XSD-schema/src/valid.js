const fs = require("fs");
const util = require("util");
const xml2js = require("xml2js");
const libxmljs = require("libxmljs");
const xmlbuilder = require("xmlbuilder");

const schemaParser = new xml2js.Parser();

let schema = fs.readFileSync(`${__dirname}/schema.xsd`, "utf8");
schema = libxmljs.parseXml(schema);

const errorXml = (errDetails) => {
    if (errDetails)
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <error>
      <message>The XML document is not valid against the XSD schema</message>
      <details>${errDetails.map((el) => el)}</details>
    </error>`;
    else
        return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <error>
        <message>The XML document is not valid against the XSD schema</message>
      </error>`;
};

// Create a validator function for the customer element in the schema
exports.customerValidator = (req, res, next) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).send(errorXml());

    const xml = xmlbuilder.create(req.body).end({ pretty: true });

    const xmlDoc = libxmljs.parseXml(xml);

    const validationErrors = xmlDoc.validate(schema);

    const errDetails = xmlDoc.validationErrors.toString().split("\n");

    if (!validationErrors) {
        return res.status(400).send(errorXml(errDetails));
    }

    next();
};

// Parse the schema using xml2js
// let parsedSchema;
// schemaParser.parseString(schema, function (err, result) {
//     if (err) {
//         console.error(err);
//     } else {
//         parsedSchema = result;
//     }
// });

// Check that the request body is a string and is not empty
// if (!util.isString(xmlBody) || xmlBody.trim().length === 0) {
//   return res.status(400).json({ error: "Invalid request body" });
// }

// Define a schema using libxmljs
// const userSchema = libxmljs.parseXml(`
//   <xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
//     <xsd:element name="user">
//       <xsd:complexType>
//         <xsd:sequence>
//           <xsd:element name="name" type="xsd:string"/>
//           <xsd:element name="email" type="xsd:string"/>
//         </xsd:sequence>
//       </xsd:complexType>
//     </xsd:element>
//   </xsd:schema>
// `);
