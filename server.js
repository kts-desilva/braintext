function vec_result(res, num_classes) {
    var i = 0,
        vec = [];
    for (i; i < num_classes; i += 1) {
        vec.push(0);
    }
    vec[res] = 1;
    return vec;
}

function maxarg(array) {
    return array.indexOf(Math.max.apply(Math, array));
}

const brain=require("brain.js");
const mimir=require("mimir");
const network=new brain.NeuralNetwork();

var ANN_Classes = {
    SAD: 0,
    NEUTRAL: 1,
    HAPPY: 2
};

var classes_array = Object.keys(ANN_Classes);

var texts = [
    // sad
    "sad and horrible feelings can destroy mental ability and cause depression in large scale",
    "No longer can bear this sad feeling , being bad is also sad, it is so heart broken",
    "Funeral ceremony,gloomy friday, such a bad day ever",
    // neutral
    "We want to trade with someone who has Houston tickets, but ",
    "cant fall asleep",
    "has work this afternoon",
    // happy
    "Great way to start with amazing results ",
    "Lovely and you are amazing",
    "Happiness,love, victory and amazed by the crowd "
]

var dict=mimir.dict(texts);

/*network.train([
 {input:{f:"i",s:"am",t:"happy"},output:{sad:1}},
 {input:{f:"she",s:"is",t:"sad"},output:{sad:1}},
 {input:{f:"he",s:"is",t:"angry"},output:{sad:1}},
 {input:{f:"we",s:"are",t:"not happy"},output:{sad:1}},
 {input:{f:"they",s:"are",t:"neutral"},output:{neutral:1}},
 {input:{f:"i",s:"am",t:"amazing"},output:{happy:1}}
 ])*/


var traindata = [
        [mimir.bow(texts[0], dict), ANN_Classes.SAD],
        [mimir.bow(texts[1], dict), ANN_Classes.SAD],
        [mimir.bow(texts[2], dict), ANN_Classes.SAD],
        [mimir.bow(texts[3], dict), ANN_Classes.NEUTRAL],
        [mimir.bow(texts[4], dict), ANN_Classes.NEUTRAL],
        [mimir.bow(texts[5], dict), ANN_Classes.NEUTRAL],
        [mimir.bow(texts[6], dict), ANN_Classes.HAPPY],
        [mimir.bow(texts[7], dict), ANN_Classes.HAPPY],
        [mimir.bow(texts[8], dict), ANN_Classes.HAPPY]
    ],
    test_happy = "great day to start with",
    test_neutral = "heart broken feelings can be healed",
    test_bow_happy = mimir.bow(test_happy, dict),
    test_bow_neutral = mimir.bow(test_neutral, dict);

var net = new brain.NeuralNetwork(),
    ann_train = traindata.map(function (pair) {
        return {
            input: pair[0],
            output: vec_result(pair[1], 3)
        };
    });

net.train(ann_train);
//console.log('------------------- ANN (brain) ----------------------');
var predict = net.run(test_bow_happy);
//console.log(predict);
//console.log(classes_array[maxarg(predict)]); // prints HISTORY
console.log(classes_array[maxarg(net.run(test_bow_neutral))]); // prints MUSIC


var http = require('http');
var util = require('util');
var qs = require('querystring');
var emotion='';
var ed={};

http.createServer(function (req, res) {

    console.log('Request received: ');
    var body='';

    //util.log(util.inspect(req)) // this line helps you inspect the request so you can see whether the data is in the url (GET) or the req body (POST)
    //util.log('Request recieved: \nmethod: ' + req.method + '\nurl: ' + req.url) // this line logs just the method and url

    res.writeHead(200, { 'Content-Type': 'application/json' });
    req.on('data', function (chunk) {
        body+=chunk;
        console.log('GOT DATA!');
    });

    req.on('end', function () {
        var pp=qs.parse(body);
        console.log(JSON.parse(body).data);
        test_bow_data = mimir.bow(JSON.parse(body).data, dict);
        ed=net.run(test_bow_data);
        console.log(ed);
        emotion=classes_array[maxarg(net.run(test_bow_data))];
        console.log(emotion);
    });
    //res.end(emotion);
    //console.log(emotion);
    res.end(JSON.stringify({ e: ed }));

}).listen(3000);
console.log('Server running on port 1337');
