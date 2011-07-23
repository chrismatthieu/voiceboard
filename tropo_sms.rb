#----------
# Group sms
#----------
require 'open-uri'
require 'json'

url = 'http://voiceboard.heroku.com/api/smsnumbers/' + $currentCall.callerID + '.json'
mymessage = $currentCall.initialText
            
#JSON data to a Ruby hash
data = JSON.parse(open(url).read)
            
#Get the relevant data
phones = data["user"]["phones"]

#start the blasting
numbers = phones.split(",")
numbers.each do |number|

   message(mymessage, {
	:to => number,
	:network => "SMS",
  :callerID => $currentCall.calledID.to_s
})
 end
 

