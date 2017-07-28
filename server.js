var http = require("http");
var mysql = require("mysql");
var url = require("url");
var querysting = require("querystring");

var conInfo = {
	host : '127.0.0.1', // 데이터베이스 아이피 또는 url
	user : 'root',	  // 사용자 id
	password : 'mysql', // pw
	port : 3306,	  // port
	database : 'mydb'	  // db
};

// 1. 요청 url 분석 처리 
// /aribnb/search?checkin=201700727&checkout=201700730&a=1&b=asd
var server = http.createServer(function(request, response){
    // request : 사용자 요청 정보 조회
    // response : 사용자에게 처리결과 응답
    if(request.url.startsWith("/airbnb/house")){
        var parsedUrl = url.parse(request.url);
        var search = querysting.parse(parsedUrl.query);
        // 가. 검색조건이 없는 검색
        // executeQuery(response);
        // 나. 검색조건이 있는 검색
        executeQuery(response, search);
    } else {
        response.writeHead(404, {"Content-Type" : "text/html;charset=uft-8"});
        response.end("<h1> 404 Page not found </h1>");
    }
});

// 2. 쿼리 실행
function executeQuery(response, search){
    var query = " select * from house a join reservation b" 
    + " on a.id=b.house_id ";
    var values = [];
    console.log(search);
    if(search){
        query = query + " where 1=1 ";
        // search 오브젝트의 key를 반복문을 돌면서 꺼내고
        for(key in search){
            // key의 이름을 쿼리에 삽입하고 
            query = query + " and b." + key + " = ? ";
            // key로 조회한 값을 values에 담는다..
            values.push(search[key]);
        }
    }
    // select * from house where checkin = ? and checkout = ?
    console.log("QUERY : " + query);

   var values = null;

   var con = mysql.createConnection(conInfo);
    con.connect();
    con.query(query, values, function(err, items, fields){
        if(err){
            console.log(err);
            sendResult(response, err);
        } else {
            console.log(items);
            sendResult(response, items);
        }
        this.end();  // mysql 연결 해제
    });
}

// 3. 결과값 전송 
function sendResult(response, data){
    response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
    response.end(JSON.stringify(data));
}

// java의 thread의 start와 같은 것 
server.listen(1112, function(){
    console.log("server is running....!");
});