const Publication = require("../models/Publication");
const collection = require("../utils/collection");
const path = require("path");

class PublicationController {
    async getAll(req, res) {

        // TODO: Implement get all logic
        res.json({ success: true, data: [] });
    
    }

    async getById(req, res) {
        
        const { id } = req.params;
        // TODO: Implement get by ID logic
        res.json({ success: true, data: { id } });
        
    }

    async create(req, res) {
        
        const {title, publication_year, abstract, authors, sources,type, publication_link, status, grant_id} = req.body;
        const created_by = req.user.id;
        const pdf_url = req.file
            ? path.posix.join("uploads", path.basename(req.file.destination), req.file.filename)
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
            pdf_url
        });
        res.status(201).json(collection(true, "Added Publication Successfully", null, "SUCCESS"));

    }

    /*
        const publication = await Publication.findById(id);

        res.json(
            publication.toJSON({ req })
        );
    */

    async update(req, res) {

        const { id } = req.params;
        const data = req.body;
        // TODO: Implement update logic
        res.json({ success: true, data: { id, ...data } });
    }

    async delete(req, res) {
        
        const { id } = req.params;
        // TODO: Implement delete logic
        res.json({ success: true, message: 'Deleted successfully' });
        
    }
}

module.exports = new PublicationController();
