export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  authKeyAdmin: process.env.AUTH_KEY_ADMIN,
});
