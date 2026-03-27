const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },

        publication_year: {
            type: Number,
            required: true,
            min: 1900,
            max: new Date().getFullYear()
        },

        abstract: {
            type: String,
            trim: true,
            maxlength: 5000
        },

        authors: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Researcher"
            }],
            validate: [arr => arr.length > 0, 'At least one author is required']
        },

        sources: [
            {
                type: String,
                trim: true
            }
        ],

        type: {
            type: String,
            required: true,
            // enum: [
            //     'journal',
            //     'conference',
            //     'book',
            //     'book_chapter',
            //     'thesis',
            //     'report'
            // ],
            index: true
        },

        publication_link: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'Invalid URL']
        },

        pdf_url: {
            type: String,
            trim: true,
            match: [/^(https?:\/\/.+|uploads\/.+)$/, 'Invalid PDF path']
        },

        status: {
            type: String,
            required: true,
            enum: ['draft', 'published'],
            default: 'draft',
            index: true
        },

        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        grant_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grant"
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

publicationSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret, options) {

        if (
            options?.req &&
            ret.pdf_url && 
            ret.pdf_url.trim() !== ''
        ) {
            ret.full_PDF_URL = `${options.req.protocol}://${options.req.get('host')}/${ret.pdf_url}`;
        }

        return ret;
    }
});

const Publication = mongoose.model("Publication", publicationSchema);

module.exports = Publication;
