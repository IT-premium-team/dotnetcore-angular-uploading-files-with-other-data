# uploading-files-with-other-data
The project contains some code snippets from Angular &amp; .Net Core projects. Ti shows how to upload files with other payload data.

The main problem is that we need to send a payload as a single object to the server side application.
In order to avoid magic trics like with sending the main form data in the payload and the files somehow the other way, we could use FormData where we can store the main form data (FeedbackDTO's email and message fields) and also some files.
