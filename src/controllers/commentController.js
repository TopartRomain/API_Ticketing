const commentService = require('../services/commentService');

const addComment = async (req, res, next) => {
  try {
    const comment = await commentService.add(req.params.id, req.user, req.body);
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await commentService.listByTicket(req.params.id, req.user);
    res.status(200).json({ success: true, count: comments.length, data: comments });
  } catch (err) {
    next(err);
  }
};

module.exports = { addComment, getComments };
