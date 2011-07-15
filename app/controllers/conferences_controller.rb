class ConferencesController < ApplicationController

  # GET /conferences
  # GET /conferences.xml
  def index
    @conferences = Conference.where("inprogress = ?", true)

    respond_to do |format|
      format.html { 
        @conferences = Conference.find(:all, :order => 'created_at desc', :limit => 10) 

        FlickRaw.api_key = CONFIG['flickr_key']
        FlickRaw.shared_secret = CONFIG['flickr_secret']

        @photos = []
        
        # Search API = http://hanklords.github.com/flickraw/FlickRaw/Flickr/Photos.html#method-i-search
        # flickr.photos.getRecent(:tags => 'pony', :per_page => '2').each do |p|
        # flickr.photos.search(:text => 'burning man', :per_page => '2').each do |p|
        flickr.photos.search(:tags => 'bm2010', :per_page => '10').each do |p|
          info = flickr.photos.getInfo(:photo_id => p.id) # retrieve additional details
          @photos.push(FlickRaw.url_b(info))
        end
      }
      format.xml  { render :xml => @conferences }
      format.json  { render :json => @conferences }
    end
  end

  # GET /conferences/1
  # GET /conferences/1.xml
  def show
    @conference = Conference.find(params[:id])
    
    #Add Voicememo record to log that the caller has heard this message
    @voicememo = Voicememo.new
    @voicememo.conference_id = @conference.id
    @voicememo.callerid = params[:callerid]
    @voicememo.save

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @conference }
      format.json  { render :json => @conference }
    end
  end

  # GET /conferences/new
  # GET /conferences/new.xml
  def new
    @conference = Conference.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @conference }
      format.json  { render :json => @conference }
    end
  end

  # GET /conferences/1/edit
  def edit
    @conference = Conference.find(params[:id])
  end

  # POST /conferences
  # POST /conferences.xml
  def create
    @conference = Conference.new(params[:conference])

    respond_to do |format|
      if @conference.save
        format.html { redirect_to(@conference, :notice => 'Conference was successfully created.') }
        format.xml  { render :xml => @conference, :status => :created, :location => @conference }
        format.json  { render :json => @conference, :status => :created, :location => @conference }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @conference.errors, :status => :unprocessable_entity }
        format.json  { render :json => @conference.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /conferences/1
  # PUT /conferences/1.xml
  def update
    @conference = Conference.find(params[:id])

    respond_to do |format|
      if @conference.update_attributes(params[:conference])
        format.html { redirect_to(@conference, :notice => 'Conference was successfully updated.') }
        format.xml  { head :ok }
        format.json  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @conference.errors, :status => :unprocessable_entity }
        format.json  { render :json => @conference.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /conferences/1
  # DELETE /conferences/1.xml
  def destroy
    @conference = Conference.find(params[:id])
    @conference.destroy

    respond_to do |format|
      format.html { redirect_to(conferences_url) }
      format.xml  { head :ok }
      format.json  { head :ok }
    end
  end
end



