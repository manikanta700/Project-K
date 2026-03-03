import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: { type: String },
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Date, required: true },
    trackingId: { type: String, default: '' },
    courier: { type: String, default: '' }
})

// Generate a short readable order ID after saving
orderSchema.post('save', async function (doc) {
    if (!doc.orderId) {
        const shortId = 'ORD-' + doc._id.toString().slice(-6).toUpperCase();
        await mongoose.model('order').findByIdAndUpdate(doc._id, { orderId: shortId });
    }
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel;