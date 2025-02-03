const z = require("zod");

// here we use the zod library to create a schema for the user object
const userSchema = z.object({
  userName: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long" })
    .max(50, { message: "Username cannot exceed 50 characters" })
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" }),

  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(50, { message: "First name cannot exceed 50 characters" })
    .trim(),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(50, { message: "Last name cannot exceed 50 characters" })
    .trim(),
});

module.exports = userSchema;
