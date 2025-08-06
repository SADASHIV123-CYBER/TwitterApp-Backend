class CastError extends Error {
    constructor(message = "Invalid ID format") {
        super(message);
        this.name = "CastError";
        this.statusCode = 400;
        this.success = false;
    }
}

export default CastError;
