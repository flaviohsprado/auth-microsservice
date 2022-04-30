/* istanbul ignore file */
import * as bcrypt from 'bcrypt';

export const createHash = async (password: string) => {
  const salt = await bcrypt.genSalt();

  return await bcrypt.hash(password, salt);
};

export const checkHash = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
