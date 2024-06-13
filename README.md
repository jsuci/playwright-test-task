# Playwright Test Task

- Pick a proxy-server from an array of string in the format ["username:password@proxy.ip:port", "..."]
- With the proxy picked, set it for the Playwright browser session, setting username, password, host and port if provided in the string
- Start a Playwright window
- Navigate to "https://admin-demo.moosocial.com/admin/home/login"
- Login using "demo@moosocial.com" and "admin" as password
- Navigate, using the menu, to the Site Manager -> Themes Manager
- Download one of the template ZIP files (using the "Download" icon to the far right) using the button - NOT by copying the URL of the button
- Save the file in the project root directory
- Log out

## Installation

Install my-project with npm

```bash
cd playwright-test-task
npm install
```

## Running Task

To run task, run the following command

```bash
  cd tests
  node moosocial.com.js
```
