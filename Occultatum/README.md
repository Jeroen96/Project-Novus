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

# Usage of user_api requests
### Creating an account [POST]

* `username: string ` [required]
* `password: string ` [required]
```json
{
    "username": "Bob",
    "password": "SomethingSafe"
}
```
* Returns status 201 upon succesful account creation
* Returns status 409 upon duplicate username

### Logging in [POST]
* `username: string ` [required]
* `password: string ` [required]
```json
{
    "username": "Bob",
    "password": "SomethingSafe"
}
```
* Returns status 401 when invalid password is entered
* Returns 404 when user is not found
* Returns following upon success:
```json
{
    "token": tokenobject
}

tokenobject example
{
    "iss": "Bob",
    "usr": 1
}
```

## Admin only routes
### Update Pending [PUT]
Used to update pending users to full users or admins.

* `username: string ` [required]
* `accepted: boolean ` [required]
* `userRights: number ` [required when accepted: true] 1 for user, 2 for admin
```json
{
    "username": "Bob" ,
    "accepted": true,
    "userRights": 1
}
```
### Update user [PUT]
Used to update users. Admins can delete users, change passwords and/or userRights.

* `username: string ` [required]
* `delete: boolean ` [required]
* `newPassword: string ` [required when delete: false] 
* `newUserRights: number ` [required when delete: false]

When delete: true, newPassword and newUserRights are not required. When delete: false or simply not added newPassword AND/OR newUserRights are required.
```json
{
    "username": "Bob" ,
    "accepted": true,
    "userRights": 1
}

