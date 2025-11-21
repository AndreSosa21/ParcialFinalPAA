

export const validateStrings = (fields = []) => {
  return (req, res, next) => {
    for (const field of fields) {
        if (typeof req.body[field] !== "string" || req.body[field].trim() === "") {
            return res.status(400).json({ message: `Field '${field}' must be a non-empty string.` });
        }
    }
    next();
  };}

 export const validateEmail = () => {
  return (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format."
      });
    }

    next();
  };
};


  export const validateFieldsComplete = (fields = []) => {
    return (req, res, next) => {
      for (const field of fields) { 
            if (!(field in req.body)) {
                return res.status(400).json({ message: `Field '${field}' is required.` });
            }
        }
        next();
    };
  }

export const validatePasswordStrength = () => {
  return (req, res, next) => {
    const { password } = req.body;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      });
    }

    next();
  };
};

export const validateAllowedFields = (allowedFields = []) => {
  return (req, res, next) => {
    const bodyFields = Object.keys(req.body);

    for (const field of bodyFields) {
      if (!allowedFields.includes(field)) {
        return res.status(400).json({
          message: `Field '${field}' is not allowed in this endpoint.`
        });
      }
    }

    next();
  };
};

