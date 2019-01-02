// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  // production: false,
  // env:"dev",
  // apiHost:"https://kyc.belrium.io",
  // apiPort:"",
  // apiRoutePath:"/api/v1/",
  // apiWalletHost:"https://node1.belrium.io",
  // apiWalletPort:"",
  // apiWalletRoutepath:"/api/",
  // captchaKey:"6LdheloUAAAAAK5yAsywvRcDsvAAevhRcnFpvDWA"
  production: false,
  env:"dev",
  // apiHost:"http://54.254.190.96",
  apiHost:"http://54.254.174.74",
  apiPort:"8080",
  apiRoutePath:"/api/v1/",
  apiWalletHost:"http://54.254.174.74",
  apiWalletPort:"8080",
  apiWalletRoutepath:"/api/",
  apiPayrollDappHost:"http://54.157.252.226",
  apipayrollDappPort:"9305",
  apiPayrollDappRoutepath:"/api/",
  apiSuperDappHost:"http://54.157.252.226",
  apiSuperDappPort:"9305",
  apiSuperDappRoutepath:"/api/dapps",
  sDAPPID:"048c1869547f60db8a6cd93b06a786abe5f50c4567198f4df0376462f9a20c5e",
  captchaKey:"6LfciH0UAAAAAHGzbKf0cACnoQL_6YLf9vRWxQbs"
};
