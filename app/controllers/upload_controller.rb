class UploadController < ApplicationController
  def index
     render 'uploadfile'
  end
  def uploadFile
      post = DataFile.save(params[:filename])
       @conference = Conference.find(:first, :conditions => ['inprogress = ?', true])
       if @conference
         @conference.inprogress = false
         @conference.filename = params[:filename].original_filename
         @conference.save
       end
       render :nothing => true, :status => 200, :content_type => 'application/json'
  end

end
