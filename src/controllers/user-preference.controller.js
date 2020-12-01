const Address = require('../models/address');
const UserPreference = require('../models/user-preference');
const http = require('http');
const { post } = require('../routes/preference');
var ObjectId = require('mongoose').Types.ObjectId;


exports.getUserPreferences = function(req, res) {
    UserPreference.aggregate([
        { "$match": {} },
        {
            "$lookup": {
                "from": "address_books",
                "localField": "address_id",
                "foreignField": "_id",
                "as": "favourite_addresses"
            },
        },
        {
            "$lookup": {
                "from": "shops",
                "localField": "shop_id",
                "foreignField": "_id",
                "as": "favourite_shops"
            },
        }
    ]).exec((err, pref) => {
        if (err) throw err;
        try {
            res.json(
                {   _id: pref[0]._id,
                    favourite_shop: pref[0].favourite_shops && pref[0].favourite_shops.length > 0 ? pref[0].favourite_shops[0] : null,
                    favourite_address: pref[0].favourite_addresses && pref[0].favourite_addresses.length > 0 ? pref[0].favourite_addresses[0] : null,
                    fulfillment_method: pref[0].fulfillment_method
                }
            );
        } catch (error) {
            res.json({})
        }
    })
}


exports.getAddressBook = function (req, res) {
    const user = req.user;
    Address.find({
        user_id: ObjectId(user.id)
    }, (err, addressBook) => {
        if (err) {
            res.send(err);
        }
        res.json(addressBook);
    });
}

exports.addAddress = function (req, res) {
    const user = req.user;
    let address = new Address(req.body);

    http.get(`http://api.postcodes.io/postcodes/${address.postcode}`, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            const geo = JSON.parse(data);
            const admin_district = geo.result.admin_district;
            
            if (geo.status == 200) {
                try {
                    address.user_id = user._id;
                    address.address = address.address.toLowerCase().includes(admin_district.toLowerCase()) ? address.address.trim() : `${address.address.trim()}, ${admin_district}`
                    address.save()
                    res.status(201).send(address)
                } catch (error) {
                    res.status(400).send(error)
                }
            } else {
                res.status(400).send(geo);
            }
        });

    }).on('error', (err) => {
        res.status(400).send(err);
    });
}

exports.updatedAddress = async (req, res, next) => {
    const address_id = req.params.address_id;

    // update address
    try {
        const {
            address,
            postcode,
            phone,
            notes
        } = req.body;

        Address.findOneAndUpdate({
            _id: ObjectId(address_id)
        }, {
            $set: {
                address: address,
                postcode: postcode,
                phone: phone,
                notes: notes
            }
        }, (err) => {
            if (err) {
                res.status(400).send(err)
            }
            res.status(204).send()
        });

    } catch (error) {
        res.status(400).send({
            error: error.message
        })
    }
};

exports.deleteAddress = function (req, res) {
    const address_id = req.params.address_id;

    Address.findOneAndDelete({
        _id: ObjectId(address_id)
    }, function (err, data) {
        if (err) res.status(400).send(err);
        res.status(204).send();
    });
}

exports.addPreference = function (req, res) {
    const preference = new UserPreference(req.body);

    try {
        preference.save()
        res.status(201).send(preference)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.updatePreference = function (req, res) {
    // update preference
    try {
        const fav_id = req.params.fav_id;
        const preference = req.body;

        UserPreference.findOneAndUpdate({
            _id: ObjectId(fav_id)
        }, {
            $set: {
                address_id: preference.address_id,
                shop_id: preference.shop_id
            }
        }, (err) => {
            if (err) {
                res.status(400).send(err)
            }
            res.status(201).send(preference)
        });

    } catch (error) {
        res.status(400).send({
            error: error.message
        })
    }
}