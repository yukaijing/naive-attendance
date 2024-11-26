const R = require('ramda');
const CryptoUtil = require('../util/cryptoUtil');
const CryptoEdDSAUtil = require('../util/cryptoEdDSAUtil');
const ArgumentError = require('../util/argumentError');
const Transaction = require('../blockchain/transaction');

class TransactionBuilder {
    constructor() {
        this.listOfUTXO = null;
        this.outputAddress = null;
        this.totalAmount = null;
        this.changeAddress = null;
        this.feeAmount = 0;
        this.secretKey = null;
        this.type = 'regular';
        this._studentId = null;
        this._eventId = null;
        this._timestamp = Date.now();
    }

    from(listOfUTXO) {
        this.listOfUTXO = listOfUTXO;
        return this;
    }

    to(address, amount) {
        this.outputAddress = address;
        this.totalAmount = amount;
        return this;
    }

    change(changeAddress) {
        this.changeAddress = changeAddress;
        return this;
    }

    fee(amount) {
        this.feeAmount = amount;
        return this;
    }

    sign(secretKey) {
        this.secretKey = secretKey;
        return this;
    }

    type(type) {
        this.type = type;
        return this;
    }

    studentId(studentId) {
        this._studentId = studentId;
        return this;
    }

    eventId(eventId) {
        this._eventId = eventId;
        return this;
    }

    timestamp(timestamp) {
        this._timestamp = timestamp;
        return this;
    }

    build() {
        if (this.listOfUTXO == null) throw new ArgumentError('It\'s necessary to inform a list of unspent output transactions.');
        if (this.outputAddress == null) throw new ArgumentError('It\'s necessary to inform the destination address.');
        if (this.totalAmount == null) throw new ArgumentError('It\'s necessary to inform the transaction value.');

        let totalAmountOfUTXO = R.sum(R.pluck('amount', this.listOfUTXO));
        let changeAmount = totalAmountOfUTXO - this.totalAmount - this.feeAmount;

        let self = this;
        let inputs = R.map((utxo) => {
            let txInputHash = CryptoUtil.hash({
                transaction: utxo.transaction,
                index: utxo.index,
                address: utxo.address,
                studentId: self._studentId,
                eventId: self._eventId,
                timestamp: self._timestamp
            });
            utxo.signature = CryptoEdDSAUtil.signHash(CryptoEdDSAUtil.generateKeyPairFromSecret(self.secretKey), txInputHash);
            return {
                transaction: utxo.transaction,
                index: utxo.index,
                amount: utxo.amount,
                address: utxo.address,
                studentId: self._studentId,
                eventId: self._eventId,
                timestamp: self._timestamp,
                signature: utxo.signature
            };
        }, this.listOfUTXO);

        let outputs = [];
        outputs.push({
            amount: this.totalAmount,
            address: this.outputAddress
        });

        if (changeAmount > 0) {
            outputs.push({
                amount: changeAmount,
                address: this.changeAddress
            });
        } else {
            throw new ArgumentError('The sender does not have enough to pay for the transaction.');
        }

        return Transaction.fromJson({
            id: CryptoUtil.randomId(64),
            hash: null,
            type: this.type,
            data: {
                inputs: inputs,
                outputs: outputs
            }
        });
    }
}

module.exports = TransactionBuilder;