agent = plugin ( = privilege)

=== Configuration ===
0. Add secret.js with mailgun's key



API

// agentDB's keyid & ownerid is set. But inside keyDB and userDB's agentId array is not set.
// to achieve this, go to db_operations/agent_db_ops./addAgent


1. register account
POST /web-api/user/signup
{
    "username":"qinnan",
    "email":"You@Email.com",
    "password":"Your Password"
}

2. activate account
GET /web-api/user/activate/{activation-code}

or 
1.2 user login
POST /web-api/user/login
{
    "username":"qinnan" or "email"
    "password":"Your Password"
}

3. query keys
GET /web-api/key/query

4. add privilege to keys
POST /web-api/privilege/add
{
    "privilege":"common",
    "key":"Your API Key"
}

5. (agent) agent program apply a agent instance id
POST /agent-api/agentinstance/add 
{
    agenttype:"common",
    key:"YweojoU .... weIAd=="
}
6. (agent) post data
POST /agent-api/plugin/append/{agent-type}
{
	"agent-id":"5cc0d8a5335d190ae9478c7f",
	"key":"YjU3YTA5 ... ZGFmOA==",
	"data":{
		"loadavg":[1,1,1],
		"corenum":4,
		"cpuuser":0.2,
		"cpusys":0.2,
		"memtotal":2319231430,
		"memfree":343425233,
		"memavail":2343432,
		"disk":[
			{
				"name":"sdb",
				"write":343,
				"read":2434
			},{
				"name":"sda",
				"write":34,
				"read":434
			}
		]
	}
}

7. query agent instance meta data
GET /web-api/agent/query

8. query agent instance data
POST /web-api/plugin/query/{agent-type}
{
	"agent-id":"5cc0d8a5335d190ae9478c7f",
	"timestampe?":
}