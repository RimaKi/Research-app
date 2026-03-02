class ResearcherController {
    async create(req, res) {
        
        const {} = req.body;

        // TODO: Implement create logic
        res.status(201).json({ success: true, data });
        
    }

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

module.exports = new ResearcherController();
