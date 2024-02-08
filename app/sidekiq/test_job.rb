class TestJob
  include Sidekiq::Job

  def perform(*args)
    puts "TEST JOB"
  end
end
