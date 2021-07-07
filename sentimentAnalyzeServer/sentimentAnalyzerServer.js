const express = require('express');
const app = new express();

const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/", (req, res) => {
    res.render('index.html');
});

app.get("/url/emotion", (req, res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': true,
            },
            'keywords': {
                'emotion': true,
                'sentiment': true,
            },
        },
    };

    let naturalLanguageUnderstanding = getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let ent = analysisResults.result.entities;
            res.send(JSON.stringify(ent.length < 1 ? [] : ent[0].emotion, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
            res.send(JSON.stringify({ 'status': 400 }))
        });
});

app.get("/url/sentiment", (req, res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': true,
            },
            'keywords': {
                'emotion': true,
                'sentiment': true,
            },
        },
    };

    let naturalLanguageUnderstanding = getNLUInstance();
    let txt = "Text not long enough.";

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let kw = analysisResults.result.entities;
            console.log(analysisResults);
            txt = (kw.length < 1 ? txt : kw[0].sentiment.label);
            return res.send(txt);
        })
        .catch(err => {
            console.log('error:', err);
            res.send(txt);
        });
});

app.get("/text/emotion", (req, res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': true,
            },
            'keywords': {
                'emotion': true,
                'sentiment': true,
            },
        },
    };

    let naturalLanguageUnderstanding = getNLUInstance();

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let ent = analysisResults.result.keywords;
            res.send(JSON.stringify(ent.length < 1 ? [] : ent[0].emotion, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
            res.send(JSON.stringify({ 'status': 400 }))
        });
});

app.get("/text/sentiment", (req, res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'entities': {
                'emotion': true,
                'sentiment': true,
            },
            'keywords': {
                'emotion': true,
                'sentiment': true,
            },
        },
    };

    let naturalLanguageUnderstanding = getNLUInstance();
    let txt = "Text not long enough.";

    naturalLanguageUnderstanding.analyze(analyzeParams)
        .then(analysisResults => {
            let kw = analysisResults.result.keywords;
            txt = (kw.length < 1 ? txt : kw[0].sentiment.label);
            return res.send(txt);
        })
        .catch(err => {
            console.log('error:', err);
            res.send(txt);
        });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
