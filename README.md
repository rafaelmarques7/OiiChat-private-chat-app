# (Private!) Chat app


App is live and running as expected, no major bugs: http://dq5rcunnxjcst.cloudfront.net/

Tomorrow we're gonna create the following functionality:
* ability to generate a QR code to:
  * invite someone to private conversation (and set password automatically and save to vault)
  * share profile and add as friend (?)
  

checkpoint - the "vault" functionality is working, but missing some features
- when user joins room, we need to add the functionality to save password to vault
- DRY after

there's a small bug with the onlineParticipants, but i'm not gonna concern too much about this (its only on page load, and only influences +1 user, so it's not a priority) 

We need a vault.
A vault is going to contain all the password used for the different conversations that a user is part of.
Note that these passwords will be stored encrypted in our database. We do not store the original passwords.

The user journeys looks as follows:
* when the user signs up, they will select a encryption password that is used to encode their vault
  * this password should be different from the users account password
* upon login, the user has to enter their encryption password to access their (previous) private conversations
* when the users joins a room and enters a password to
  * the client app makes a POST request to update the vault
  * the request contains the encrypted password

* to summarize, the server stores the following client details:
  * salted and hashed user password
    * when the user logs in, we salt and hash the typed password and compare it to the salted and hashed password in the servers database 
  * salted and hashed user encryption key
    * when the user enters their vault encryption key, we salt and hash the typed password and compare it to the salted and hashed password in the servers database 
  * encrypted password rooms
    * using the users encryption key

Having written the above, I now see that having 1. password and 2. encryption key is too much. No users wants that.
So, we'll just have 1 password (stored salted and hashed), and we use that to encrypt the user vault 

We also have to change one thing:
* only the owner of the room can set the rooms password (and also the name of the room)
  * for now, we'll also make it so that rooms password can not be changed (this is because changing the password would change the encryption which would also make the previous messages unreadable)

User journey for creating rooms is as follows:
* a user clicks on a button to create a new room
* the user is redirected to a new page
* the user is asked to
  * select a name for the room
  * select visibility: public or private
    * (if private), select a password for the room
    * (if public), no password is asked for, and the messages will not be encrypted

User journey for joining a room:
  *  if rooms password exists in user vault 
     * password is automatically filled
     * user can immediately send messages
  *  if room password is Not available in the vault
     * user is asked to enter password for the room
     * password is encrypted and saved to the users vault

ToDo:
* create a new tag in github
* nice extras:
  * favicon
  * app title
* Share with friends has the wrong text



today, we'll:
1. create an `active-users` feature
   1. this will display a horizontal bar with icons with the initial of every user (similar to messages)
   2. on tapping the icon, it should display the full username
   3. users with no username should be "anonymous"
   4. if there are more than one anonymous users connected, they should be grouped (the icon should contain a superset indicating the number of anonymous users connected)
2. create a `my-rooms` feature
   1. this should display a list of all the rooms a user is part of
      1. clicking on the link/room should take the user to that room
      2. it should also contain metadata about the room, like privacy of room, date of creation, last message, number of users, etc.
   2. on mobile, it should be its own page
   3. on desktop, it should be displayed on the left side
3. create a `public-rooms` feature
   1. exactly the same as `my-rooms` feature, but for public rooms only
4. Remove encryption from public rooms
  

This is the only way to manage private user rooms.

The user journey is as follows:
* the user clicks on signup, which takes him to a new page
* user must enter
  * username and password
  * before being sent to the backend, password should be salted and hashed
* this will create basic user information in the database {idUser, username, timestamp, password, vault}
* upon navigating to a page, the username will automatically be filled
* each user has a vault, where the passwords for each room are stored
  * each item in the vault is encrypted, and the user password is used as the encryption key
  * {vault: [{idRoom, encryptedKey}]}


desired features:


* show users connected to a room
* only allow user to post message when username has been selected
* when the messages are, display a lock icon instead of a message hash
* add a tooltip on tap to each icon
* ability to make rooms public or private (default to private)
* give rooms a name (and icon?)
* show when user is typing

### Multiple rooms

We want to support multiple rooms, so that each user can create their own private chat room.

How would this look like on the frontend (describe user journeys)?
What is required to support this on the backend (be)?

Frontend:
* user clicks on a button to "create new chat room"
  * (be) this should trigger a call to the backend to create a new room, which should respond with a `idRoom`
  * (fe) this `idRoom` is used in to create a new frontend URL for the new room
* user is taken to a new web page
* user can now interact with the chatroom and invite friends (share via link), configure the username password, and send messages


Let's try to deploy this:
s3 static website
ECS container
mongodb atlas

Today we're building a private chat app.

It works as follows:
* a user creates a new private room and select a password for encryption
  * the encryption will be done on the client side
  * this means the server will only get an encrypted message (and the user can verify this by inspecting the POST requests made by the browser to the backend) 
* when a friend connects to the room, they will see encrypted messages (because that's the only thing that the server has too!)
  * to decrypt the messages, the person who created the room needs to share the password with their friends

So, unlike WhatsApp and most other messaging apps where encryption is handled by the server, meaning that user has to trust the company providing the service, this actually guarantees that the message provider can not read your messages. 

The question that remain is, can this system be abused? Probably. There are a lot of people a lot smarter than me out there. So, how could this be abused?
  * Would it be possible for the chat provider to steal the users password?
  * Would it be possible to store a copy of the message before it is encrypted?
  * I just noticed one other exploit
    * using the browsers developer console, a user can indeed inspect websocket requests, and see the messages being transmitted
    * one thing to note is: a malicious service provider could abuse the encryption in the following way: instead of encrypting just the message, they could:
      * create a custom payload which includes the message and the user selected password: {message, password}
      * create it's own encryption key and use this to encrypt the custom payload
      * decrypt the message on the server, this way getting both the message and the users password, thus abusing the system and exploiting the users trust
      * Now, can this issue be overcome? Can we make it verifiable?
      * I believe the answer is yes: as long as the structure of the message sent to the backend is specified (for example: {message, userId, timestamp}), then the user can run their own encryption, using their specified password, targeting the specified custom payload, and verify that the encrypted value matches the one sent to the server. 
        * If they do, the message is being encrypted using the users password, and the message is safe
        * If they don't match, then the service provider is abusing the system
        * But, the important thing is that the user can verify this if they want! 

I think that the question to both of those answers is yes, it can, but I think it could easily be detected and exposed. Any request to the backend is visible on the browsers console, so, this means users could verify that their data and trust is not being abused.


useful links:
https://chakra-ui.com/docs/components/select

## CICD

I setup the CICD using github actions, but I can not get the `.env` files to work correctly during the build steps.

## Bugs

* In mobile, page is slightly too large (on the phone)
* mobile, anacvar is sllightly cut off
* typing password scrolls down