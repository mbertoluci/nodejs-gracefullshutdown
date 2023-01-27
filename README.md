#Gracefull Shutdown
This is an example how we can manipulate errors to create a Graceful shutdown and close the connections before or app close because of an unexpected crash.

To execute this example, run:
* yarn install

In a terminal execute:

`curl -i -X POST --data '{"nome": "My name", "age":22}' localhost:3000`

Then found the process to kill it, you can use:

`ps aux | grep index.js`

And then you can kill the process using the pid, this way:

`kill 1222`

And then, you can check the console logs to see the app will simulate the closing of the connections before leaving.

For this example we are using createServer from 'node:http' and once from 'node:events'

So, you will need to use a new node version to do it. 
