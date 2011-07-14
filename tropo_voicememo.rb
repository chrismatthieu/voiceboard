require 'rubygems'
require 'json'
require 'rest-client'

myvoice = "Kate"

#apiurl = 'http://web1.tunnlr.com:11053' #test
apiurl = 'http://voiceboard.heroku.com' #production


say "welcome to the burning man voice board!", {:voice => myvoice}

while $currentCall.isActive do

  conferences = RestClient.get apiurl + '/conferences.json'
  confdata = JSON.parse(conferences)


  if confdata[0].nil?

    result = ask "Press one to listen to the voice board or two to start a new recording", {
      :voice => myvoice,
      :choices => "[1 DIGITS]",
      :attempts => 3}

    if result.value == '1'
      # Get list of voice messages
      memos = RestClient.get apiurl + '/voicememos.json?callerid=' + $currentCall.callerID
      memodata = JSON.parse(memos)
      if memodata[0].nil?
        say "you are up to date on all voice memos", {:voice => myvoice}
      else
        lastmsg = 0
        memodata.each do |memo|
          if lastmsg != 0 
            say "next message.", {:voice => myvoice}
          end
          lastmsg = memo["conference"]["id"]
          memorec = RestClient.get apiurl + '/conferences/' + memo["conference"]["id"].to_s + '.json?callerid=' + $currentCall.callerID
          memorecdata = JSON.parse(memorec)
          say "http://voicememo-uploads.s3.amazonaws.com/" + memorecdata["conference"]["filename"]
        end
      end
  
    elsif result.value == '2'
    
      # Start a recorded conference call
      confid = "burn" + rand(10000000).to_s

      # Write a conf
      conf = RestClient.post apiurl + '/conferences.json', "[conference][filename]=" + confid + "&[conference][inprogress]=1"
    
      say "starting new voice board conference, press pound to stop recording", {:voice => myvoice}
    
      startCallRecording apiurl + '/uploadfile', {
          :format => 'audio/mp3'}
    
      conference confid, {
        :terminator => "#",
        :playTones => true}
    
      stopCallRecording
    
      say "thank you. your message has been recorded on the voice board.", {:voice => myvoice}
  
    end
  
  else
  
    if confdata
      #join existing conference
      confname = confjson[0]["conference"]["filename"]
      say "joining existing voice board conference", {:voice => myvoice}
      conference confname, {
        :terminator => "#",
        :playTones => true}
    else
      say "something went wrong. sorry.", {:voice => myvoice}
    end
  end

end #loop

#curl POST -d "[conference][filename]=hello&[conference][inprogress]=1" http://web1.tunnlr.com:11053/conferences.json
#RestClient.post "http://web1.tunnlr.com:11053/conferences.json", "[conference][filename]=hello&[conference][inprogress]=1"