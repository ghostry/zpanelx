try{
    var topdomain=top.document.domain;
    if(topdomain!=self.document.domain){
        alert("Redirecting...");
        top.location.replace(self.document.URL.substring(0,self.document.URL.lastIndexOf("/")+1))
            }
        }catch(e$$5){
    alert("Redirecting... (error: "+e$$5);
    top.location.replace(self.document.URL.substring(0,self.document.URL.lastIndexOf("/")+1))
        };
