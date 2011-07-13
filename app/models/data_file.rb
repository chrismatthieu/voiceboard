class DataFile < ActiveRecord::Base

  require 'rubygems'
  require 'aws/s3'
  
  def self.save(upload)
    name =  upload.original_filename
    
    if name.length > 0       

       AWS::S3::Base.establish_connection!(
          :access_key_id      => CONFIG['aws_access_key_id'],
          :secret_access_key  => CONFIG['aws_secret_access_key']
          
        )
        AWS::S3::S3Object.store(name, open(upload), CONFIG['aws_bucket'], :access => :public_read)  

    end
  end
  
end
