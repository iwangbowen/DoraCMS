module.exports = function(req,res,next){
    res.text = function(txt){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(txt);
        res.end();
    }
    next();
}