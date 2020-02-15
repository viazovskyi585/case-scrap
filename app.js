const express = require('express');
const path = require('path');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname + '/client/index.html'));
});

app.get('/api/:court/:caseID', async (req, res) => {
    const { court, caseID } = req.params;
    console.log(court + caseID);
    const data = await getCaseDate(court, caseID);
    const info = {
        date: data[0],
        name: data[1],
        id: data[2],
        sides: data[3],
        content: data[4],
        type: data[5],
        hall: data[6]
    };
    res.status(200).json(info);
});

app.listen(8000, () => {
    console.log('App running on port 8000 👓');
});

const getCaseDate = async (court, caseID) => {
    const caseIDEncoded = encodeURI(caseID);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://pm.od.court.gov.ua/sud${court}/gromadyanam/csz/`, {
        waitUntil: 'networkidle0'
    });
    await page.click('#cleardate');
    await page.type('#filter', caseIDEncoded);

    const data = await page.evaluate(() => {
        const tds = document.querySelectorAll('#assignments tr.odd td');
        return Array.from(tds).map(v => v.textContent);
    });

    await browser.close();

    return data;
};
