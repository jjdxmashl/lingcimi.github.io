function createXMLHttpRequest() {  
    var xmlHttp;  
    if (window.XMLHttpRequest) {  
        xmlHttp = new XMLHttpRequest();  
    } else if (window.ActiveXObject) {  
        try {  
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");  
        } catch (e) {  
            try {  
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");  
            } catch (e) { 
            }  
        }  
    }  
    return xmlHttp;  
} 

function requestCount(url) {
    if (document.domain != "127.0.0.1") {
        var xmlhttp = createXMLHttpRequest(); 
        xmlhttp.open("GET","/api/requestcount.php?url=".concat(url),false);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");  
        xmlhttp.send();
        document.write(xmlhttp.responseText);
    } else {
        document.write("测试环境");
    }
}

function openApiContent(){
    var xmlhttp = createXMLHttpRequest(); 
    xmlhttp.open("GET","/api/openapi.php",false);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");  
    xmlhttp.send();
    document.write(xmlhttp.responseText);
}