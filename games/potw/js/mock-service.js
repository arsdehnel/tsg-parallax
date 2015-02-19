$MQL("r:app.test.message.request",function(msg,data)
{
   switch ( Math.floor( Math.random() * 3) )
   {
       case 0:
       {
    	   ($MQ('r:app.test.message.response',{
    		   'success':true,
    	       'message':'Test mock'
    	    })).delay(1);
           break;
       }
       case 1:
       {
    	   ($MQ('r:app.test.message.response',{
    		   'success':true,
    	       'message':'Test mock 1'
    	    })).delay(1);
           break;
       }
       case 2:
       {
    	   ($MQ('r:app.test.message.response',{
    		   'success':true,
    	       'message':'Test mock 2'
    	    })).delay(1);
           break;
       }
   }
    
});


$MQL('r:customer-profile.request', function(type,msg,datatype,from)
{
	   var myJSON = null;
	   switch ( Math.floor( Math.random() * 3) )
	   {
	       case 0:
	       {
			      myJSON={
				            name:'Joe Mazzola1',
				            address:'3535 Piedmont Rd',
				            city:'Atlanta',
				            state:'GA',
				            zip:'30305'
				            };
	           break;
	       }
	       case 1:
	       {
			      myJSON={
				            name:'Joe Mazzola2',
				            address:'3531 Piedmont Rd',
				            city:'Atlanta',
				            state:'GA',
				            zip:'30305'
				            };
	           break;
	       }
	       case 2:
	       {
			      myJSON={
				            name:'Joe Mazzola3',
				            address:'3532 Piedmont Rd',
				            city:'Atlanta',
				            state:'GA',
				            zip:'30305'
				            };
	           break;
	       }
	   }

	   $MQ('r:customer-profile.response',myJSON);     
});