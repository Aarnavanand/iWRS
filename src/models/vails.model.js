const mongoose = require('mongoose');

const VialSchema = new mongoose.Schema({
    vial_kit_code: {
        type: mongoose.Schema.Types.Number,
        ref: "KitVaills",
        required: true,
    },
    vial_code: {
        type: String,
        maxlength: 6,
        required: true,
    },
    vial_type: {
        type: String,
        enum: ['NS', 'IP'],
        required: true,
    },
    site_id: {
        type: mongoose.Schema.Types.Number,
        required: true,
    },
    vial_status: {
        type: String,
        enum: ['0', '1', '2', '3'],
        default: '0',
    },
    vial_created_by: {
        type: mongoose.Schema.Types.Number,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: null,
    },
    vial_approved: {
        type: String,
        enum: ['0', '1', '2'],
        default: '0',
    },
    vial_approved_by: {
        type: mongoose.Schema.Types.Number,
        default: null,
    },
    vial_approved_at: {
        type: Date,
        default: null,
    },
    vial_dispatch_by: {
        type: mongoose.Schema.Types.Number,
        default: null,
    },
    vial_dispatch_at: {
        type: Date,
        default: null,
    },
    vial_discard_by: {
        type: mongoose.Schema.Types.Number,
        default: null,
    },
    vial_discard_at: {
        type: Date,
        default: null,
    },
    vial_sub_id: {
        type: mongoose.Schema.Types.Number,
        default: null,
    },
    vial_reject_desc: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.model('Vial', VialSchema);
