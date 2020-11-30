const Shop = require('../models/shop');

exports.getAllShops = function(req, res) {
    Shop.aggregate([
        { "$match": {} },
        {
            "$lookup": {
                "from": "opening_hours",
                "localField": "_id",
                "foreignField": "shop_id",
                "as": "opening_hours"
            },
        },
        {
            "$lookup": {
                "from": "fulfillment_methods",
                "localField": "_id",
                "foreignField": "shop_id",
                "as": "fulfillment_methods"
            },
        }
    ]).exec((err, shops) => {
        if (err) throw err;
        res.json(shops);
    })
}

exports.getShops = function(req, res) {
    Shop.find({}, (err, shops) => {
        if(err){
            res.send(err);
        }
        res.json(shops);
    });
}