const Address = require('../models/address');
const http = require('http');
var ObjectId = require('mongoose').Types.ObjectId;

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
          if (geo.status == 200) {
            try {
                address.user_id = user._id;
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
    const user = req.user;

    // update address
    try {
        const { address, postcode, phone, notes } = req.body

        http.get(`http://api.postcodes.io/postcodes/${postcode}`, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
            const geo = JSON.parse(data);
            if (geo.status == 200) {
                try {
                    Address.findOneAndUpdate({_id: ObjectId(address_id)}, {$set:{address: address, postcode: postcode, phone: phone, notes: notes}}, (err) => {
                        if (err) {
                            res.status(400).send(err)
                        }
                        res.status(204).send()
                    });
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


    } catch (error) {
        res.status(400).send({ error: error.message })
    }
};

exports.deleteAddress = function (req, res) {
    const address_id = req.params.address_id;

    Address.findOneAndDelete({ _id: ObjectId(address_id) }, function (err, data) {
        if (err) res.status(400).send(err);
        res.status(204).send();
    });
}

exports.addPreference = function (req, res) {}

exports.updatePreference = function (req, res) {}