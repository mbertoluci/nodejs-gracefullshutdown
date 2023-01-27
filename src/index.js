import { createServer } from 'node:http'
import { once } from 'node:events'

async function handler(request, response) {
    try{
        //it will get the data attribute from the request and try to convert it in a JSON.
        const data = JSON.parse(await once(request, 'data'))
        console.log('\nreceived', data)

        //we will return 200 if everything works as expected.
        response.writeHead(200)

        //it will return the same JSON that we got from the request
        response.end(JSON.stringify(data))

        //here will create an error in another context, this try catch won't be able to get this one.
        setTimeout(() => {
            throw new Error('Will be handle on uncaught')
        }, 1000)

        //here will create an error in another context as well but using a Promise instead.
        Promise.reject('Will be handle on unhandleRejection')

    }catch(error){
        //Here will just get the stack error to log.
        console.log('We found a error', error.stack)

        //setting error 500 code
        response.writeHead(500)

        response.end()
    }
}

//here will create a server to listening in a 3000 port
const server = createServer(handler)
    .listen(3000)
    .on('listening', () => console.log('server running at 3000'))

//Basically here will start the Graceful Shutdown
function gracefulShutdown(event){
    return (code) => {
        console.log(`${event} received with ${code}`)
        server.close(() => {
            console.log('http server closed')
            console.log('db connection closed')
            process.exit(code)
        })
    }
}

//it will catch the uncaught exceptions
process.on('uncaughtException', (code, origin) => {
    console.log(`${code}, treatment ${origin}`)
});

process.on('unhandledRejection', (code) => {
    console.log(`${code}, treatment`)
})

//Signal events will be emitted when the Node.js process receives a signal. Please refer to signal(7) for a listing of standard POSIX signal names such as 'SIGINT', 'SIGHUP', etc.

//from the terminal is supported on all platforms, and can usually be generated with Ctrl+C (though this may be configurable). It is not generated when terminal raw mode is enabled and Ctrl+C is used.
process.on('SIGINT', gracefulShutdown('SIGINT'))

//is not supported on Windows, it can be listened on.
process.on('SIGTERM', gracefulShutdown('SIGTERM'))

// event is emitted when the Node.js process is about to exit as a result of either:
process.on('exit', gracefulShutdown('EXIT'))


