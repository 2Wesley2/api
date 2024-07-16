const handleValidationErrors = (errors, res) => {
  if (!Array.isArray(errors) || errors.length > 0) {
    const highestStatus = errors.reduce(
      (highest, error) => Math.max(highest, error.status),
      400,
    );
    return res.status(highestStatus).json({
      messages: errors.map((e) => e.msg),
      errors: errors,
    });
  }
};

module.exports = handleValidationErrors;
