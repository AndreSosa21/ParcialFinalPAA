import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";
import { getUserByEmail, createUser } from "../../db/models/users.model.js";

export const register = async ({ username, email, password }) => {
  const exists = await getUserByEmail(email);

  if (exists) throw new Error("Email already registered");

  const hash = await bcrypt.hash(password, 10);

  const user = await createUser({ username, email, password_hash: hash });

  return {
    message: "User registered successfully",
    user,
  };
};

export const login = async ({ email, password }) => {
  const user = await getUserByEmail(email);

  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error("Invalid credentials");

  const token = generateToken({ id: user.id, email: user.email });

  return { token, user };
};
