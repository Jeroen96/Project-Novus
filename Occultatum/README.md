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
### Request examples
- Calls which don't require login
    - ["jberk.nl/userApi/createAccount"](#creating-an-account-post)
    - ["jberk.nl/userApi/login"](#logging-in-post)
- Calls which require login and admin rights
    - ["jberk.nl/userApi/updatePending"](#update-pending-put)
    - ["jberk.nl/userApi/updateUser"](#update-user-put)
    - ["jberk.nl/userApi/createSensor"](#create-sensor-post)
    - ["jberk.nl/userApi/updateSensor"](#update-sensor-put)

### Creating an account [POST]

* `username: string ` [required]
* `password: string ` [required]
```json
{
    "username": "Bob",
    "password": "SomethingSafe"
}
```
### Logging in [POST]
* `username: string ` [required]
* `password: string ` [required]
```json
{
    "username": "Bob",
    "password": "SomethingSafe"
}
```
Returns following upon success:
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
* `delete: boolean ` [required if true]
* `newPassword: string ` [required when delete: false] 
* `newUserRights: number ` [required when delete: false] 1 for user, 2 for admin

When delete: true, newPassword and newUserRights are not required. When delete: false or simply not added, newPassword AND/OR newUserRights are required.
```json
{
    "username": "Bob" ,
    "newPassword": "SomethingSafer",
    "newUserRights": 2
}
```
### Create sensor [POST]
Used to create sensors. 
* `username: string ` [required]
* `password: string ` [required]

```json
{
    "username": "Wemos_Outside" ,
    "password": "SomethingSafe"
}
```
### Update sensor [PUT]
Used to update users. Admins can delete users, change passwords and/or userRights.

* `username: string ` [required]
* `delete: boolean ` [required if true]
* `newPassword: string ` [required when delete: false] 
* `newUserRights: number ` [required when delete: false] 1 for user, 2 for admin

When delete: true, newPassword and newUserRights are not required. When delete: false or simply not added, newPassword AND/OR newUserRights are required.
```json
{
    "username": "Bob" ,
    "newPassword": "SomethingSafer",
    "newUserRights": 2
}
```
