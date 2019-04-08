module.exports = {
  auth: {
    azure: {
      provider: 'azuread',
      password: 'cookie_encryption_password_secure',
      clientId: 'a6f2f7c7-662f-4de8-8466-63e4dc3ce9dc',
      clientSecret: 'E2jaen07cWGBzJ5nMPGxs6Myc+z483996/ey4OTQUhU=',
      config: {
        tenant: 'f90a3c58-a777-489e-a4a4-226105ba5b30'
      },
      isSecure: false
    },
    session: {
      password: 'password-should-be-32-characters',
      redirectTo: '/',
      appendNext: true,
      isSecure: false
    }
  },
  database: {
    host: 'timeclock.c2ie2hf7z3ux.us-east-1.rds.amazonaws.com',
    port: 3306,
    database: 'timeclock',
    username: 'timeclock',
    password: '12345678'
  }
};