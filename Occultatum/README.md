# Occultatum *backend*
###### The NodeJs project that functions as the REST API and Deployment Server
![alt text](https://www.shareicon.net/data/256x256/2015/10/06/112725_development_512x512.png)

This is the NodeJS folder. This folder contains all files for the backend.
This project uses `app.js` as it's entry point. From here two routes are used for the **meterkast api** (`mk_api.js`) and **web_api** (`web_api.js`).

## Project Dependencies

This NodeJS project makes use of the following packages.

- [express][express]
- [body-parser][body]
- [jwt-simple][jwt]
- [mysql][mysql]
- [cors][cors]

[jwt]: https://www.npmjs.com/package/jwt-simple
[express]: https://www.npmjs.com/package/express
[mysql]: https://www.npmjs.com/package/mysql
[body]: https://www.npmjs.com/package/body-parser
[cors]: https://www.npmjs.com/package/cors
