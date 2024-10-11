import http from 'node:http'

const server = http.createServer(async (req, res) => {
    return res.writeHead(200).end('Rocketseat Nodejs Aulas!')
})

server.listen(9999, () => {
    console.log('HTTP server running on http://localhost:9999') 
})
