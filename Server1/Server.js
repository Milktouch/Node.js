const fs= require('fs')
const http = require('http')
const port = 300
const server =http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'})
    fs.readFile('Test1.html',function(error,data){
        if(error){
            res.writeHead(404)
            res.write('Error: File not found')
        }
        else{
            res.write(data)

        }
        res.end()
    })
})
server.listen(port,function(error){
    if(error){
        console.log('Soething is wrong')

    }
    else{
       console.log('listening on port' + port)
    }
});