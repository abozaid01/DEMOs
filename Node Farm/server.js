const http = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = require('./modules/replaceTemplate');

//it will be effecient to put the reading function outside the route
//it's blocking, but every time the user will request the route the reading statement will not execute every time
const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const dataObj = JSON.parse(data); //we need javascript object when buliding our templates

const tempOverview = fs.readFileSync(`${__dirname}/views/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/views/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/views/template-product.html`, 'utf-8');

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    //overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);
    }
    //product page
    else if (pathname === '/product') {
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output);
    }
    //API
    else if (pathname === '/api') {
        res.writeHead(200, { contentType: 'application/json' });
        res.end(data);
    }
    //NOT FOUND Page
    else
        res.writeHead(404, {
            contentType: 'text/html',
            myHeader: 'hello-world', //set header for meta data
        }).end('<h1>page not found</h1>');
});

server.listen(3000, '127.0.0.1', (err) => {
    if (err) console.log(err);
    console.log('🚀 listening on port 3000');
});
