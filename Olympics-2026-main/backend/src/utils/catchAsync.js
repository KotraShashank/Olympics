// Express does not automatically catch errors thrown inside async functions.
// Spring Boot does this for you; here we replicate it with one small wrapper
// so controllers never need a try/catch block.
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
