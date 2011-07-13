class VoicememosController < ApplicationController
  # GET /voicememos
  # GET /voicememos.xml
  def index
    
    # Build array of conference call recordings that have not yet been listened to by the callerid
    @voicememos = []
    @conferences = Conference.all
    @conferences.each do |conference|
      if conference.voicememos.find(:first, :conditions => ['callerid = ?', params[:callerid]]).nil?
        @voicememos.push(conference)
      end
    end  

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @voicememos }
      format.json  { render :json => @voicememos }
    end
  end

  # GET /voicememos/1
  # GET /voicememos/1.xml
  def show
    @voicememo = Voicememo.find(params[:id]) rescue []
    
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @voicememo }
      format.json  { render :json => @voicememo }
    end
  end

  # GET /voicememos/new
  # GET /voicememos/new.xml
  def new
    @voicememo = Voicememo.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @voicememo }
      format.json  { render :json => @voicememo }
    end
  end

  # GET /voicememos/1/edit
  def edit
    @voicememo = Voicememo.find(params[:id])
  end

  # POST /voicememos
  # POST /voicememos.xml
  def create
    @voicememo = Voicememo.new(params[:voicememo])

    respond_to do |format|
      if @voicememo.save
        format.html { redirect_to(@voicememo, :notice => 'Voicememo was successfully created.') }
        format.xml  { render :xml => @voicememo, :status => :created, :location => @voicememo }
        format.json  { render :json => @voicememo, :status => :created, :location => @voicememo }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @voicememo.errors, :status => :unprocessable_entity }
        format.json  { render :json => @voicememo.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /voicememos/1
  # PUT /voicememos/1.xml
  def update
    @voicememo = Voicememo.find(params[:id])

    respond_to do |format|
      if @voicememo.update_attributes(params[:voicememo])
        format.html { redirect_to(@voicememo, :notice => 'Voicememo was successfully updated.') }
        format.xml  { head :ok }
        format.json  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @voicememo.errors, :status => :unprocessable_entity }
        format.json  { render :json => @voicememo.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /voicememos/1
  # DELETE /voicememos/1.xml
  def destroy
    @voicememo = Voicememo.find(params[:id])
    @voicememo.destroy

    respond_to do |format|
      format.html { redirect_to(voicememos_url) }
      format.xml  { head :ok }
      format.json  { head :ok }
    end
  end
end
