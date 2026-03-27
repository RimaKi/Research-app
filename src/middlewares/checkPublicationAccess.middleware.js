const Publication = require("../models/Publication");

const checkPublicationAccess = async (req, res, next) => {
  try {
    const { id } = req.params;

    const publication = await Publication.findById(id);

    // ❌ Not found
    if (!publication) {
      return res.status(404).json(
        collection(false, "Publication not found", null, "NOT_FOUND")
      );
    }

    // ❌ Forbidden
    if (
      publication.created_by.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json(
        collection(false, "Forbidden", null, "FORBIDDEN")
      );
    }

    // ✅ Attach publication to request (VERY useful)
    req.publication = publication;

    next();
  } catch (err) {
    return res.status(500).json(
      collection(false, "Server error", err.message, "SERVER_ERROR")
    );
  }
};

module.exports = checkPublicationAccess;