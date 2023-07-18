I want to build two documents: TLDR version, 3 min read; and full version, 20-30 min read

- [Motivation](#motivation)
- [What I build](#what-i-build)
- [How it works, high level over](#how-it-works-high-level-over)
  - [Journey 1 - Create a chat Room](#journey-1---create-a-chat-room)
  - [Journey 2 - Inviting someone to a Chat](#journey-2---inviting-someone-to-a-chat)
    - [Private Rooms:](#private-rooms)
    - [Public Rooms:](#public-rooms)
  - [Journey 3 - Sending messages](#journey-3---sending-messages)
  - [Journey 4 - Sign up](#journey-4---sign-up)
  - [Journey 5 - "My conversations"](#journey-5---my-conversations)
  - [Journey 6 - "My vault"](#journey-6---my-vault)
- [How it works, deep dive](#how-it-works-deep-dive)
  - [Journey 1 - Create a chat Room](#journey-1---create-a-chat-room-1)
  - [Journey 3 - Sending and receiving messages](#journey-3---sending-and-receiving-messages)
    - [Journey 3.1 - Validating the room password](#journey-31---validating-the-room-password)
    - [Journey 3.2 - Sending messages](#journey-32---sending-messages)
  - [Journey 3.3 - Receiving messages](#journey-33---receiving-messages)
  - [Journey 4 - Sign up](#journey-4---sign-up-1)
  - [Journey 4.1 - Sign In](#journey-41---sign-in)
- [Notes on Security](#notes-on-security)
- [How can you trust me? (Hint, you don't)](#how-can-you-trust-me-hint-you-dont)


The goal of this document is to explain why I built this project, and to detail exactly how it works, particularly when it comes to the encryption feature, which is the main difference between this app and most other chat apps out there.

So, let's jump right in.

## Motivation

WhatsApp is end-to-end encrypted, right? So... does this mean that WhatsApp can't read your messages?

Honestly, this is a question that I would like someone a lot smarter than me to try to answer. But, the way I see it is: WhatsApp (and other apps like it) control the encryption key used to encrypt your message. And because of this, this means that WhatsApp **can** ready your messages. As a user, you (and me) are trusting WhatsApp not to do so, but if they wanted to, they could. (Once again, if I am wrong about this, please do let me know, and point me to some documentation that explains why this is not the case.)

So, the question that followed after this was: is it even possible to build a ChatApp that that is encrypted **and whose messages can not not be read by the chat service provider**? And if so, what would that look like?

Initially, thinking about this, I thought that: "no, this isn't possible. Even if the app allows the user to select their own encryption key, the user still has to type this password inside a form that is controlled by the chat service provider, and this means that the chat service provider can read this encryption key, and abuse it, if they so desire".

After thinking some more, I also realized that: "While this may be true, **if the user can verify that their encryption key is not being sent to the server, then they can be sure that the chat service provider is not able to read the encrypted messages**" (see [this section](#how-can-you-trust-me-hint-you-dont) for more on this).

And so, I realized, it is possible to build a chat app that can **not** be abused by the chat service provider. And thus, this project was born. So, now, let's explore exactly what I build, how it is different from most chat apps, and how you can easily verify it's security by yourself.

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
  * Message history
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

### Journey 1 - Create a chat Room

As above, the user journey is (copy paste):
* a User clicks on a button to create a new chat *Room* and is taken to a new page
  * the user selects a `room name`, and `visibility` (`public` or `private`)
  * if the room is `private`, the user must select a `room password`
* the user clicks on the "Create Room" button
  * if there is an issue, the user is notified about the error
  * if successful, the user is redirected to the rooms page and they can start chatting

**Now, what happens under the hood?**

On the client side (the users browser), the app does the following:
* the `room password` is used to encrypt a `testMessage`, resulting in an `encryptedTestMessage`
  * the `testMessage` is unique for each room and generated at run time using `uuid`
    * the `testMessage` and `encryptedTestMessage` will become relevant later, because they are used to validate if the password the user has selected is correct
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

---

### Journey 3 - Sending and receiving messages

When the chat page loads, 
  * the app creates a `simpleCrypto` client (see [simplecrypto.org](https://simplecrypto.js.org/))
    * the `simpleCrypto` client is what allows the app to encrypt and decrypt the messages before sending them to the server
  * the app makes a request to the server to load any old messages

#### Journey 3.1 - Validating the room password

Upon joining the room for the first time, if the room is private, the messages will be encrypted. To decrypt the messages, the user has to submit a correct room password. Below we explain how this process works.

When the user types a password:
* the password is used to encrypt the `testMessage` associated to this room (see [Create Room journey](#journey-1---create-a-chat-room-1)), 
* this value is then compared to the rooms `encryptedTestMessage` 
  * if they match, the typed room password is correct
  * if they don't match, then nothing changes
  * (see `isCorrectRoomPassword` function)

When the user selects the correct password: 
  * the previous messages are decrypted, meaning that they can now be read
  * the password of the room is saved in the browsers local storage (see `saveRoomPasswordToLS` function)
    * this means that the next time you enter this room, the app can reload the rooms password without you having to type it again (notice that the server does not have access to this information)

**TLDR:** the selected password is used to encrypt a `testMessage` that is used to check if the password is correct 

#### Journey 3.2 - Sending messages

As above, the user journey is (copy paste):
* a User navigates to a room
* (if the user is not logged in) the user selects a username
* the User types a message
* the User clicks Send

**Now, what happens under the hood?**
    
When a user submits a message:
* the app uses the `simplyCrypto` client to encrypt the typed message
  ```js
  const payload = {
      username,
      text: simpleCrypto.encrypt(value),
      timestamp: Date.now(),
  };
  socket.emit("eventChatMessage", payload, roomId);
  ```
Notice that:
  * **we only send encrypted messages to the server** (for private rooms)


### Journey 3.3 - Receiving messages

**Upon receiving a live message:**

* the app uses the `simpleCrypto` client to decrypt the typed message
  ```js
  function onChatMessageEvent(event) {
      setEvents((previous) => [
      ...previous,
      decryptEvent(newSimpleCrypto, event),
      ]);
  }
  socket.on("eventChatMessage", onChatMessageEvent);
  ```
Notice that the `simpleCrypto` client has been initialized before
  * it may either have been initialized with an empty or a wrong password, in which case the decryption will fail, and the user will only be able to see encrypted value of the message, as is stored on the server
  * or, the user may have already submitted a correct password, in which case the `simpleCrypto` client has been updated to use this password, and the decryption will succeed. 

**Upon loading Message History**

The app also has the ability to display a chat history (that is, older messages). 
  * when the chat page is rendered for the first time, the app makes a request to the server to get the most recent messages
  * the user has also the option to click on a button to load more older messages, if they are available. 
   
In both cases, the process is similar: load encrypted messages from the server, and decrypt them on the client side using the rooms password.  

---

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

I omitted the Sing In journey on the high level overview, because it was quite straightforward. But, for the deep dive, I think it is good to talk about it.

**This is what happens under the hood:**

* the user types the username and password
  * the client app uses the `username` to make a request to the server to get the users `salt`
  * the app adds the `salt` to the typed `password`, resulting in a `saltedPassword` 
* the app makes a request to the backend to check if the `username` and `saltedPassword` match a user in the database
  * if it does not, the app displays an error message 
  * if it does, the request is successful and the app logs in the user

Notice that:
  * the app does not send your password to the server.

**TLDR:** The app makes two requests to the backend: one to get the user `salt`, and a second to validate the login using the `saltedAndHashedPassword`.  

---

## Notes on Security

One important thing to note is: I state here that this app is built in such a way that your messages can not be read by chat service provider. That, I believe, is true. Now, does this mean that your messages are absolutely safe, and that they can not be decrypted by a hacker? That, I believe, deserves a quick conversation.

Messages in this app are encrypted before being sent to the server. The encryption algorithm used is AES-CBC. Now, when you encrypt something, does this mean that no one can decrypt it? Not necessarily. If you select a weak password (like password, or 1234), then hackers will be able to decrypt it easily. However, if you select a strong password (like `7ahSy0n@1N%6l&6B`), it is theoretically impossible for a hacker to decrypt your message. This is why, upon creating a room, we automatically suggest a strong password for it (@TODO!!!!). 

Now, I am not an expert in security, so you should take my words which a pinch of salt (that is, after all, why I am publishing this, to get feedback and see if what I'm saying is not exactly right and should be corrected), and more importantly, you should research this for yourself. But, as far as I know, encryption is currently basically unbreakable, unless you select a weak encryption key.  


## How can you trust me? (Hint, you don't)

At any point reading this, you may ask yourself: ?why would I trust you? As far as I know, you could be saying one thing and doing another?". And you are absolutely right. That is exactly my argument against WhatsApp. The answer is: you should not trust me, you should verify this by yourself. 

Of course, most people don't want to do this, but the point is that you could. You can verify for yourself if this app is doing what is says it does. (Unfortunately, you can't do this for WhatsApp, more on this later).

So, how do you verify for yourself if this app is abusing your trust? If this app is able to read your messages? Simple: You use the browsers console.

Every request made between a browser and a server is registered through the browsers console. For us, this is quite useful, because it allows the user to see exactly what is being sent to the server. 

For example, when you are signing up and clicking on the submit button, you can use the browsers console to see what data was sent to the server (in this case, data is sent using a GET request), and what response the server sent back. If you do this, you will see that the password that you submitted was not sent to the server. Instead, the payload sent to the server only includes the salted and hashed version of the password that you typed, which is theoretically impossible to decipher by itself. 

Similarly, when the users types a message, the app communicates with the server using sockets. Sockets, just like HTTP requests, are also registered by the browsers console, and can also be inspected. So, once again, a user can verify that the message that they typed was never sent to the server, and instead, that only an encrypted message was sent.

More, at this point, the user should also verify that, not only was a message encrypted before being sent, but also, that the messages was encrypted using the exact rooms password, and nothing else. If this was not the case, it would mean that the app would instead be using a different encryption key to the one you selected, and because of this, the app could exploit this to read your messages. This is not the case, and users can verify  by themselves that the messages are being encrypted using the room password. How? There are online tools which allow you to encrypt and decrypt values (for example [this one](https://www.devglan.com/online-tools/aes-encryption-decryption)). The encryption algorithm used by this app is `AES-CBC`. So, the user can simply go to an encryption-tool website, like the one linked, select the AES-CBC algorithm, and copy the message they sent through the chat app. The resulting cipher can then be compared to the one sent to the server. If they do not match, then this mean that some other encryption key was used, and you can not trust the app. However, if they match (and they will), then you know for a fact that the app is encrypted your message using your room password, and because of this, it can not be read the server. 





