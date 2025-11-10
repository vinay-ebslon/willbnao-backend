import bcrypt from "bcryptjs";

/**
 * Encrypt password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password with hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password
 * @returns Boolean indicating if passwords match
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
