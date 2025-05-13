// middleware/sanitize.js
export default function sanitize(req, res, next) {
  const sanitizeObject = (obj) => {
    if (!obj) return;
    for (const key in obj) {
      if (/^\$/.test(key) || /\./.test(key)) {
        delete obj[key]; // remove keys starting with `$` or containing `.`
      }
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);

  next();
}

sanitize.js