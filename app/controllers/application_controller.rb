class ApplicationController < ActionController::Base
  # protect_from_forgery
  
  def isNumeric(s)
      Float(s) != nil rescue false
  end
end

class DEPLOY
  CLOUDTYPE = "public" #private
end