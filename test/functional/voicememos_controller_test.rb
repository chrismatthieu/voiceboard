require 'test_helper'

class VoicememosControllerTest < ActionController::TestCase
  setup do
    @voicememo = voicememos(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:voicememos)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create voicememo" do
    assert_difference('Voicememo.count') do
      post :create, :voicememo => @voicememo.attributes
    end

    assert_redirected_to voicememo_path(assigns(:voicememo))
  end

  test "should show voicememo" do
    get :show, :id => @voicememo.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @voicememo.to_param
    assert_response :success
  end

  test "should update voicememo" do
    put :update, :id => @voicememo.to_param, :voicememo => @voicememo.attributes
    assert_redirected_to voicememo_path(assigns(:voicememo))
  end

  test "should destroy voicememo" do
    assert_difference('Voicememo.count', -1) do
      delete :destroy, :id => @voicememo.to_param
    end

    assert_redirected_to voicememos_path
  end
end
