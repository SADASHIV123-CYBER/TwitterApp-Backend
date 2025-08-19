export const getQuoteByIdManualValidator = (req, res, next) => {
  const { quoteId } = req.params;
  if (!quoteId) {
    return res.status(400).json({ message: "Quote id is required" });
  }
  next();
};
