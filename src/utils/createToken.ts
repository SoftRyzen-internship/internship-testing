import { JwtService } from '@nestjs/jwt';


const { ACCESS_TOKEN_PRIVATE_KEY = "", REFRESH_TOKEN_PRIVATE_KEY = "" } = process.env;

const createToken = (_id:number) => {
  const payload = {
    id: _id,
  };
  const jwtService = new JwtService({
    secret: ACCESS_TOKEN_PRIVATE_KEY,
    signOptions: { expiresIn: '45m' },
  });
  const accessToken = jwtService.sign(payload);

  const refreshToken = jwtService.sign(payload, {
    secret: REFRESH_TOKEN_PRIVATE_KEY,
    expiresIn: '1w',
  });

  return { accessToken, refreshToken };
};

export default createToken;