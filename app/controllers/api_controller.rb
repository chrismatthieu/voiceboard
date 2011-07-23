class ApiController < ApplicationController

  def smsnumbers
      @did = ""
      
      @phonenumber = params[:phone]
      
      @numbers =  Voicememo.find(:all, :select => "DISTINCT(callerid)")

      @numbers.each do |number|
        if isNumeric(number.callerid)
          @did << number.callerid + ","
        end
      end
      
      @did = @did.chop #remove last comma from @did string

      # Add new SMS number to voicememos if not on the list
      if !@did.index(@phonenumber)
        @voicememo = Voicememo.new
        @voicememo.callerid = @phonenumber
        @voicememo.save
      end

      respond_to do |format|
        format.xml  {}
        format.json  {}
      end
  end

end
