import bcrypt from 'bcryptjs';

/**
 * Number of salt rounds
 * Industry standard: 10–12
 */
const SALT_ROUNDS = 10;

/**
 * Hash password
 * @param plainPassword string
 * @returns hashed password
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);
  return hashedPassword;
};

/**
 * Verify password
 * @param plainPassword string
 * @param hashedPassword string
 * @returns boolean
 */
export const verifyPassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
