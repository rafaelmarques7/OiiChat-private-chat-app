# (Private!) Chat app

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

