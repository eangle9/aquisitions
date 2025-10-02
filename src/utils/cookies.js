export const cookies = {
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  }),

  set: (res, name, value, Options = {}) => {
    res.cookie(name, value, { ...cookies.getOptions(), ...Options });
  },

  clear: (res, name, Options = {}) => {
    res.clearCookie(name, { ...cookies.getOptions(), ...Options });
  },

  get: (req, name) => {
    return req.cookies[name];
  },
};
