const { body } = require('express-validator');

// Mirrors: com.sports.dto.request.MatchResultRequest
exports.matchResultValidator = [
  body('sportId')
    .notEmpty().withMessage('Sport ID is required')
    .isMongoId().withMessage('Sport ID must be a valid id'),
  body('playerScore')
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage('Score cannot be negative'),
  body('opponentScore')
    .optional({ nullable: true })
    .isInt({ min: 0 }).withMessage('Score cannot be negative'),
  body('scoreDetails')
    .optional({ nullable: true })
    .isObject().withMessage('scoreDetails must be an object'),
  body('matchNotes')
    .optional({ nullable: true })
    .isString(),
];
