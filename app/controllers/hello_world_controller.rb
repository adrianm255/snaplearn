# frozen_string_literal: true

class HelloWorldController < ApplicationController
  layout "hello_world"

  before_action :authenticate_user!

  def index
    @hello_world_props = { name: "Stranger" }

    #TODO remove
    TestJob.perform_async
  end
end
