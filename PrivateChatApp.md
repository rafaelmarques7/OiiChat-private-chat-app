The goal of this document is to explain why I built this project, and to detail exactly how it works, particularly when it comes to the encryption feature, which is the main difference between this app and most other chat apps out there.

So, let's jump right in.

## Motivation

WhatsApp is end-to-end encrypted, right? So... does this mean that WhatsApp can't read your messages?

Honestly, this is a question that I would like someone a lot smarter than me to try to answer. But, the way I see it is: WhatsApp (and other apps like it) control the encryption key used to encrypt your message. And because of this, this means that WhatsApp **can** ready your messages. As a user, you (and me) are trusting WhatsApp not to do so, but if they wanted to, they could. (Once again, if I am wrong about this, please do let me know, and point me to some documentation that explains why this is not the case.)

So, the question that followed after this was: is it even possible to build a ChatApp that that is encrypted **and whose messages can not not be read by the chat service provider**? And if so, what would that look like?

Initially, thinking about this, I thought that: "no, it is not possible to build such an app". I though that, "even if the app allows the user to select their own encryption key, the user still has to type this password inside a form that is controlled by the chat service provider, and this means that the chat service provider can read this encryption key, and abuse it, if they so desire".

After thinking some more, I also realized that: "While this may be true, if the user can verify that their encryption key is not being sent to the server, then they can be sure that the chat service provider is not able to read the encrypted messages". (more on this in a minute)

And so, I realized, it is possible to build a chat app that can **not** be abused by the chat service provider. And thus, this project was born. So, now, let's explore exactly what I build, how it is different from most chat apps, and how you can verify by yourself that this chat app is safe and its messages can not be ready by me, the chat service provider (nor by WhatsApp in this case!).

## What I build

* Chat App built using:
  * React and JavaScript for the frontend
  * Client Side rendered app, using S3 and Cloudfront for the distribution
  * NodeJs, Express and Socket.IO for the backend
  * MongoDb for the database
* Unique features:
  * Messages are encrypted, on the client side, using a user provided encryption key (we will just call these rooms' *passwords*)
* Other features:
  * Real time chat
  * Public (not encrypted) and Private (encrypted) rooms
  * 1-1 messages
  * Group messages
  * User is typing feature
  * Signup and Login
  * User vault (to store all the rooms passwords (encrypted))
  
## How it works, high level over

To explain how this app works, on a high level, I will now explain the user journeys. In the section below I will recap these user journeys and explain in more details exactly what happens at each step of each.

### Journey 1 - Create a chat Room

* a User clicks on a button to create a new chat *Room* and is taken to a new page
  * the user selects a `room name`
  * the user selects the room `visibility` (`public` or `private`)
  * if the room is `private`, the user must select a `room password`
* the user clicks on the "Create Room" button
  * if there is an issue, the user is notified about the error
  * if successful, the user is redirected to the rooms page and they can start chatting

### Journey 2 - Inviting someone to a Chat

#### Private Rooms:

* Copy the URL of the room and send it to a friend (using any desired medium)
  * Upon joining the room, new joiners will only see encrypted messages
* To see decrypted messages, new joiners must type the correct room password

#### Public Rooms:

* Anyone can join a public room by navigating to it using the app itself
* Anyone can join a public room if they a link to the room


### Journey 3 - Sending messages

* a User navigates to a room
* (if the user is not logged in) the user selects a username
* the User types a message
* the User clicks Send


### Journey 4 - Sign up

* a User clicks on a button to "Sign Up"
  * the user is redirected to a new page
* the user selects a username and password
  * if successful, the user has now signed up, is logged in, and is redirected to the home page
  * if there is an error, the app displays an error message

### Journey 5 - "My conversations"

This feature is only available for users that have signed up and are logged in.

* a User navigates to "My conversations" page
* the app displays a list of all conversations that this user has joined in the past

### Journey 6 - "My vault"

This feature is only available for users that have signed up and are logged in.

Upon joining a room:
* the user types the correct room password
* the app asks the user if they want to "add the room password to My Vault"
  * if they do, the user must type their password (which is used to encrypt the room password before storing it)
  
Upon navigating to my profile:
* the app displays a list of all conversations that this user has joined in the past
* this list includes the rooms passwords
  * all rooms passwords are encrypted
  * the user must type their own password in order to decrypt the rooms passwords

---

## How it works, deep dive

Let's start with a simple one:

### Journey 4 - Sign up

As above, the user journey is (copy paste):

* the user selects a username and password
  * if successful, the user has now signed up, is logged in, and is redirected to the home page
  * if there is an error, the app displays an error message

**Now, what happens under the hood?**

* the app creates a payload
  * the username is used as is
  * the password is *salted* **and** *hashed*
    ```javascript
        const salt = createSalt();
        const passwordSalted = `${password}${salt}`;
        
        const signUpData = {
            username,
            salt,
            password: await sha256Hash(passwordSalted),
            timestamp: Date.now(),
        };
    ```

* The app makes a POST request to the server to create a new user, using the above payload
  * If there is an error, the app displays the error
* If successful,
  * the app receives a response that contains the user details
  * the user details are added to the browsers localstorage
    * this allows the client app to know that the user is logged in
    ```js
    localStorage.setItem("ChatAppUserData", JSON.stringify(data));
    ```


Notice that:
- do NOT store your password! 
- We only store a salted and hashed version of your password. 
- And because the hashing method can not be reverted, this means that we can not recreate your original password from the salted and hashed version of it. 
  - this is also why we add a `salt`. A `salt` is just a fancy word for "random and unique large string", and it allows the hashed password to be unique, even if it's not. For example, if your password is "`password`" and we did not use a salt, a hacker could easily decipher it - even if it's hashed - using a rainbow table (which is just a fancy word for "list of common passwords and their respective hashes").  But, if it's saled, the hashed password would actually be something like "`password%jkasbdjkan0-1@{]ro1[rk`, which would not be available in rainbow tables, and which would be a lot harder (close to impossible I believe) for a hacker to decipher.  

**TLDR:** Password is salted and hashed before being sent to the server. We do not store your password.

---

### Journey 4.1 - Sign In

I omitted the Sing In journey on the high level overview, because it was obvious. But, for the deep dive, it is relevant to talk about.

**This is what happens under the hood:**

* the user types the username and password
  * the client app uses the `username` to make a request to the server to get the users `salt`
  * the app adds the `salt` to the typed `password`, resulting in a `saltedPassword` 
* the app makes a request to the backend to check if the `username` and `saltedPassword` match a user in the database
  * if it does not, the app displays an error message 
  * if it does, the request is successful and the app logs in the user

**TLDR:** The app makes two requests to the backend: one to get the user `salt`, and a second to validate the login using the `saltedAndHashedPassword`.  

---

### Journey 1 - Create a chat Room

* a User clicks on a button to create a new chat *Room* and is taken to a new page
  * the user selects a `room name`
  * the user selects the room `visibility` (`public` or `private`)
  * if the room is `private`, the user must select a `room password`
* the user clicks on the "Create Room" button
  * if there is an issue, the user is notified about the error
  * if successful, the user is redirected to the rooms page and they can start chatting

**Now, what happens under the hood?**

On the client side (the users browser), the app does the following:
* the `room password` is used to encrypt a `testMessage`, resulting in an `encryptedTestMessage`
  * the `testMessage` is unique to each room and generated at run time using `uuidv4`
  * it's important that each `testMessage` is unique, because if it was not, it could be used to 
* the app creates a payload to be sent to the server:
    ```javascript
    const payloadNewRoom = {
        roomName,
        visibility,
        testMessage,
        encryptedTestMessage,
        ownerId: userData?._id,
    }
    ```
* The app makes a POST request to the server to create a new room, using the above payload
  * If successfull, the app receives a response that includes an `idRoom`
  * The `idRoom` is used to navigate to the newly created chat page (using React Router)

> Notice that the above payload does NOT include the rooms password. This means that the server does NOT have the room password, and thus, it can not read the encrypted messages stored in the server. 

Note that:
* the above payload does NOT include the rooms password
* the payload above is sent for both public and private rooms (although the `testMessage` and the `encryptedTestMessage` have no use for the public rooms)

