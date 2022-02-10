const Order = require('../../../models/order')

function statusController() {
    return {
        update(req, res) {
            Order.updateOne({_id: req.body.orderId}, { status: req.body.status }, (err, data)=> {
                if(err) {
                    return res.redirect('/admin/orders')
                }
                // Emit event 
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })
                return res.redirect('/admin/orders')
            })
        },
        async delete(req, res) {
            try {
                await Order.deleteOne({ _id: req.query.orderId })
                return res.status(200).json({
                    errCode: 0,
                    data: req.query.orderId
                })
            } catch (error) {
                return res.status(200).json({
                    errCode: -1,
                    data: error
                })
            }
        }
    }
}

module.exports = statusController