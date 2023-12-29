import { verify } from 'jsonwebtoken';
import { TokenDto } from '../dto';

export async function verifyToken(
  token: string,
  secret: string,
): Promise<TokenDto> {
  return new Promise<TokenDto>((resolve, reject) => {
    verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      return resolve(decoded as TokenDto);
    });
  });
}