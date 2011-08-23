class DataFile < ActiveRecord::Base

  require 'rubygems'
  # require 'aws/s3'
  
  def self.save(upload)
    name =  upload.original_filename
    # name =  upload['datafile'].original_filename
    
    if name #.length > 0       

       # AWS::S3::Base.establish_connection!(
       #    :access_key_id      => CONFIG['aws_access_key_id'],
       #    :secret_access_key  => CONFIG['aws_secret_access_key']
       #    
       #  )
       #  AWS::S3::S3Object.store(name, open(upload), CONFIG['aws_bucket'], :access => :public_read)  

       # local writes
       directory = "public/data"
       # create the file path
       path = File.join(directory, name)
       # write the file
       File.open(path, "wb") { |f| f.write(upload.read) }
       # File.open(path, "wb") { |f| f.write(upload['datafile'].read) }

    end
  end
  
end
