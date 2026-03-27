const Publication = require('../models/Publication');
const collection = require('../utils/collection');
const path = require('path');
const fs = require('fs');

class PublicationController {

    /*
         const publication = await Publication.findById(id);

         res.json(
             publication.toJSON({ req })
         );
     */
    async getAll(req, res) {
        // TODO: Implement get all logic
        res.json({success: true, data: []});
    }

    async getById(req, res) {
        const {id} = req.params;
        // TODO: Implement get by ID logic
        res.json({success: true, data: {id}});
    }

    async create(req, res) {
        const {
            title,
            publication_year,
            abstract,
            authors,
            sources,
            type,
            publication_link,
            status,
            grant_id,
        } = req.body;
        const created_by = req.user.id;
        const pdf_url = req.file
            ? path.posix.join(
                'uploads',
                path.basename(req.file.destination),
                req.file.filename
            )
            : null;

        const publication = await Publication.create({
            title,
            publication_year,
            abstract,
            authors,
            sources,
            type,
            publication_link,
            status,
            grant_id,
            created_by,
            pdf_url,
        });
        res
            .status(201)
            .json(
                collection(true, 'Added Publication Successfully', null, 'SUCCESS')
            );
    }

    async update(req, res) {
        const {id} = req.params;
        const publication = req.publication;
        const {
            title,
            publication_year,
            abstract,
            authors,
            sources,
            type,
            publication_link,
            status,
            grant_id
        } = req.body;

        let pdf = publication.pdf_url;

        if (req.file) {
            if (publication.pdf_url) {
                const oldPath = path.join(process.cwd(), 'src', publication.pdf_url);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath); // delete old file
                }
            }

            pdf = path.posix.join(
                'uploads',
                path.basename(req.file.destination),
                req.file.filename
            );
        }

        const updatedPublication = await Publication.findByIdAndUpdate(
            id,
            {
                title,
                publication_year,
                abstract,
                authors,
                sources,
                type,
                publication_link,
                status,
                grant_id,
                pdf_url: pdf,
            },
            {new: true}
        );

        res.status(200).json(
            collection(
                true,
                'updated Publication Successfully',
                updatedPublication, //.populate('authors', 'name email').populate('grant_id', 'title').toJSON({ req }),
                'SUCCESS'
            )
        );
    }

    async delete(req, res) {
        const {id} = req.params;
        await Publication.findByIdAndDelete(id);

        res.status(200).json(
            collection(
                true,
                'deleted Successfully',
                null,
                'SUCCESS'
            )
        );
    }
}

module.exports = new PublicationController();
