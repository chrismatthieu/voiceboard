class ApiController < ApplicationController

  def smsnumbers
      @did = ""

      @numbers =  Voicememo.find(:all, :select => "DISTINCT(callerid)")

      @numbers.each do |number|
        if isNumeric(number.callerid)
          @did << number.callerid + ","
        end
      end

      @did = @did.chop #remove last comma from @did string

      respond_to do |format|
        format.xml  {}
        format.json  {}
      end
  end

end
