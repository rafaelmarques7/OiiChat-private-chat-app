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

I think that the question to both of those answers is yes, it can, but I think it could easily be detected and exposed. Any request to the backend is visible on the browsers console, so, this means users could verify that their data and trust is not being abused.

